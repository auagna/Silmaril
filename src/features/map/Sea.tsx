import { useEffect, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
  withTiming,
  runOnJS,
  type SharedValue,
} from "react-native-reanimated";
import type { Thread, ThreadType, ThreadConnection } from "@/types/database";
import { connections, getThreadTranslation } from "@/lib/dummy";
import { useTheme, radius, font, type Palette } from "@/theme";
import { useLocale } from "@/i18n";
import { buildModeLayout, type GraphLayoutMode, type Pos, type Pin } from "./layout";

// Sea = Active Map (Obsidian 구조 고도화).
//  · 노드 = 차수(연결 수) 기반 원(dot). 발견=채운 원 / 미발견=빈 원. 분류=타입별 뮤트 컬러.
//  · 라벨 = 줌 인 시 보이고 줌 아웃 시 페이드(text fade). 선택 노드는 항상 표시.
//  · 선택 시 이웃·연결만 강조, 나머지 흐리게.
//  · 4-force 물리: Center(밀집) · Repel(척력) · Link(관련성 스프링) · Link distance.
//  · 차수 기반 질량(허브는 덜 흔들림) + 반지름 기반 충돌.
const LABEL_W = 96;
const CANVAS_H = 380;
const MAX_NODES = 14;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const DOT_BASE = 6; // 반지름 기본
const DOT_STEP = 2.4; // 연결 1개당 증가
const DOT_MAX = 22;

// ── 물리 상수 (튜닝 포인트) ──
const REPULSION = 6500;
const CENTER = 0.022;
const DAMPING = 0.82;
const MAX_SPEED = 34;
const SETTLE_KE = 0.4;
const MAX_FRAMES = 600;
const COLLIDE_GAP = 12; // 원끼리 최소 간격
// 관련성(connection_tier) 기준 인력: tier1(사실)=가깝고 강하게, tier2(해석)=멀고 약하게.
const SPRING_T1 = 0.09;
const SPRING_T2 = 0.045;
const IDEAL_T1 = 84;
const IDEAL_T2 = 150;

// 분류(타입) → 뮤트 컬러. Day/Night 양쪽 배경에서 읽히는 중간톤.
const TYPE_COLOR: Record<ThreadType, string> = {
  person: "#B5879B",
  movement: "#8B9DC4",
  work: "#C9A66B",
  material: "#9AA68B",
  concept: "#8FB0B5",
  emotion: "#C58B8B",
  form: "#A39BC4",
  place: "#8FBF9F",
  era: "#B0A38F",
  organization: "#9FA8B0",
};

function dotRadius(degree: number): number {
  return Math.min(DOT_BASE + degree * DOT_STEP, DOT_MAX);
}
function zeroVel(ids: string[]): Record<string, Pos> {
  const v: Record<string, Pos> = {};
  for (const id of ids) v[id] = { x: 0, y: 0 };
  return v;
}
function simEdge(e: ThreadConnection) {
  const t1 = e.connection_tier === 1;
  return {
    a: e.from_thread_id,
    b: e.to_thread_id,
    ideal: t1 ? IDEAL_T1 : IDEAL_T2,
    k: t1 ? SPRING_T1 : SPRING_T2,
  };
}

export function Sea({
  litThreads,
  fogThreads,
  selectedId,
  recommendedIds,
  visitedSet,
  typeFilter,
  layoutMode,
  onSelect,
}: {
  litThreads: Thread[];
  fogThreads: Thread[];
  selectedId: string | null;
  recommendedIds?: Set<string>;
  visitedSet?: Set<string>;
  typeFilter?: ThreadType | null;
  layoutMode?: GraphLayoutMode;
  onSelect: (id: string) => void;
}) {
  const c = useTheme().colors;
  const { locale } = useLocale();
  const styles = useMemo(() => makeStyles(c), [c]);
  const width = Dimensions.get("window").width - 32;
  const cx = width / 2;
  const cy = CANVAS_H / 2;

  const nodes = useMemo(() => [...litThreads, ...fogThreads].slice(0, MAX_NODES), [litThreads, fogThreads]);
  const litSet = useMemo(() => new Set(litThreads.map((t) => t.id)), [litThreads]);
  const nodeIds = useMemo(() => new Set(nodes.map((n) => n.id)), [nodes]);

  const edges = useMemo(
    () => connections.filter((e) => nodeIds.has(e.from_thread_id) && nodeIds.has(e.to_thread_id)),
    [nodeIds],
  );

  // 차수(연결 수) → 반지름·질량.
  const degree = useMemo(() => {
    const d: Record<string, number> = {};
    for (const n of nodes) d[n.id] = 0;
    for (const e of edges) {
      d[e.from_thread_id] = (d[e.from_thread_id] ?? 0) + 1;
      d[e.to_thread_id] = (d[e.to_thread_id] ?? 0) + 1;
    }
    return d;
  }, [nodes, edges]);
  const meta = useMemo(() => {
    const m: Record<string, { m: number; r: number }> = {};
    for (const n of nodes) {
      const dg = degree[n.id] ?? 0;
      m[n.id] = { m: 1 + dg * 0.5, r: dotRadius(dg) };
    }
    return m;
  }, [nodes, degree]);

  // 선택 노드의 이웃(강조/포커스용).
  const neighborSet = useMemo(() => {
    if (selectedId == null) return null;
    const s = new Set<string>();
    for (const e of edges) {
      if (e.from_thread_id === selectedId) s.add(e.to_thread_id);
      else if (e.to_thread_id === selectedId) s.add(e.from_thread_id);
    }
    return s;
  }, [selectedId, edges]);

  // 모드별 시드 + 핀(축 고정). 선택은 시드를 바꾸지 않음.
  //  맥락=핀 없음(자유) / 시간=x 연도 고정 / 계보=y 세대 고정.
  const { seed, pins } = useMemo(
    () => buildModeLayout(layoutMode ?? "web", nodes, edges, width, CANVAS_H),
    [nodes, layoutMode, width, edges],
  );

  const positions = useSharedValue<Record<string, Pos>>(seed);
  const velocities = useSharedValue<Record<string, Pos>>(zeroVel(nodes.map((n) => n.id)));
  const idsSV = useSharedValue<string[]>(nodes.map((n) => n.id));
  const edgesSV = useSharedValue<{ a: string; b: string; ideal: number; k: number }[]>(edges.map(simEdge));
  const metaSV = useSharedValue<Record<string, { m: number; r: number }>>(meta);
  const pinsSV = useSharedValue<Record<string, Pin>>(pins);
  const draggingId = useSharedValue<string | null>(null);
  const frameCount = useSharedValue(0);

  // ── force 시뮬레이션 (UI 스레드, 매 프레임) ──
  const frame = useFrameCallback((info) => {
    "worklet";
    const ids = idsSV.value;
    const eds = edgesSV.value;
    const mta = metaSV.value;
    const pinm = pinsSV.value;
    const n = ids.length;
    if (n < 2) return;
    const pos = positions.value;
    const vel = velocities.value;
    const dragId = draggingId.value;
    if (!pos[ids[0]]) return;
    const dt = Math.min(Math.max((info.timeSincePreviousFrame ?? 16) / 16, 0.5), 2);

    const fx: Record<string, number> = {};
    const fy: Record<string, number> = {};
    for (let i = 0; i < n; i++) {
      fx[ids[i]] = 0;
      fy[ids[i]] = 0;
    }
    // 척력 (모든 쌍, 반지름 기반 충돌 간격)
    for (let i = 0; i < n; i++) {
      const a = pos[ids[i]];
      if (!a) continue;
      const ra = mta[ids[i]] ? mta[ids[i]].r : 8;
      for (let j = i + 1; j < n; j++) {
        const b = pos[ids[j]];
        if (!b) continue;
        const rb = mta[ids[j]] ? mta[ids[j]].r : 8;
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        const minD = ra + rb + COLLIDE_GAP;
        if (dist < minD) dist = minD;
        const f = REPULSION / (dist * dist);
        const ux = dx / dist;
        const uy = dy / dist;
        fx[ids[i]] += ux * f;
        fy[ids[i]] += uy * f;
        fx[ids[j]] -= ux * f;
        fy[ids[j]] -= uy * f;
      }
    }
    // 인력 (연결선 = 관련성 스프링)
    for (let k = 0; k < eds.length; k++) {
      const a = pos[eds[k].a];
      const b = pos[eds[k].b];
      if (!a || !b) continue;
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1) dist = 1;
      const f = eds[k].k * (dist - eds[k].ideal);
      const ux = dx / dist;
      const uy = dy / dist;
      fx[eds[k].a] += ux * f;
      fy[eds[k].a] += uy * f;
      fx[eds[k].b] -= ux * f;
      fy[eds[k].b] -= uy * f;
    }
    // 센터링
    for (let i = 0; i < n; i++) {
      const p = pos[ids[i]];
      if (!p) continue;
      fx[ids[i]] += (cx - p.x) * CENTER;
      fy[ids[i]] += (cy - p.y) * CENTER;
    }
    // 적분 (질량 = 차수 기반, 허브는 덜 흔들림) + 경계 클램프
    const newPos: Record<string, Pos> = {};
    const newVel: Record<string, Pos> = {};
    let ke = 0;
    for (let i = 0; i < n; i++) {
      const id = ids[i];
      const p = pos[id];
      if (!p) continue;
      const r = mta[id] ? mta[id].r : 8;
      const maxX = width - r - 4;
      const maxY = CANVAS_H - r - 4;
      const minX = r + 4;
      const minY = r + 4;
      if (id === dragId) {
        let dgx = Math.min(Math.max(p.x, minX), maxX);
        let dgy = Math.min(Math.max(p.y, minY), maxY);
        const pn = pinm[id];
        if (pn) {
          if (pn.px != null) dgx = pn.px;
          if (pn.py != null) dgy = pn.py;
        }
        newPos[id] = { x: dgx, y: dgy };
        newVel[id] = { x: 0, y: 0 };
        continue;
      }
      const mass = mta[id] ? mta[id].m : 1;
      const v = vel[id] ?? { x: 0, y: 0 };
      let vx = (v.x + (fx[id] * dt) / mass) * DAMPING;
      let vy = (v.y + (fy[id] * dt) / mass) * DAMPING;
      const sp = Math.sqrt(vx * vx + vy * vy);
      if (sp > MAX_SPEED) {
        vx = (vx / sp) * MAX_SPEED;
        vy = (vy / sp) * MAX_SPEED;
      }
      let nx = p.x + vx * dt;
      let ny = p.y + vy * dt;
      if (nx < minX) {
        nx = minX;
        if (vx < 0) vx = 0;
      } else if (nx > maxX) {
        nx = maxX;
        if (vx > 0) vx = 0;
      }
      if (ny < minY) {
        ny = minY;
        if (vy < 0) vy = 0;
      } else if (ny > maxY) {
        ny = maxY;
        if (vy > 0) vy = 0;
      }
      // 모드 핀: 고정된 축은 힘 무시(시간=x, 계보=y).
      const pn = pinm[id];
      if (pn) {
        if (pn.px != null) {
          nx = pn.px;
          vx = 0;
        }
        if (pn.py != null) {
          ny = pn.py;
          vy = 0;
        }
      }
      newVel[id] = { x: vx, y: vy };
      newPos[id] = { x: nx, y: ny };
      ke += vx * vx + vy * vy;
    }
    positions.value = newPos;
    velocities.value = newVel;
    frameCount.value += 1;
    if (ke < SETTLE_KE || frameCount.value > MAX_FRAMES) {
      runOnJS(settle)();
    }
  }, false);

  function energize() {
    frameCount.value = 0;
    frame.setActive(true);
  }
  function settle() {
    frame.setActive(false);
  }

  useEffect(() => {
    const ids = nodes.map((n) => n.id);
    positions.value = seed;
    velocities.value = zeroVel(ids);
    idsSV.value = ids;
    edgesSV.value = edges.map(simEdge);
    metaSV.value = meta;
    pinsSV.value = pins;
    energize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  // ── 캔버스 변환(팬/줌) ──
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const scale = useSharedValue(1);
  const sTx = useSharedValue(0);
  const sTy = useSharedValue(0);
  const sScale = useSharedValue(1);

  const pan = Gesture.Pan()
    .maxPointers(1)
    .onStart(() => {
      sTx.value = tx.value;
      sTy.value = ty.value;
    })
    .onUpdate((e) => {
      tx.value = sTx.value + e.translationX;
      ty.value = sTy.value + e.translationY;
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      sScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(sScale.value * e.scale, MIN_SCALE), MAX_SCALE);
    });

  const canvasGesture = Gesture.Simultaneous(pan, pinch);

  const worldStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { translateX: cx },
      { translateY: cy },
      { scale: scale.value },
      { translateX: -cx },
      { translateY: -cy },
    ],
  }));

  function zoom(factor: number) {
    scale.value = withTiming(Math.min(Math.max(scale.value * factor, MIN_SCALE), MAX_SCALE), { duration: 160 });
  }
  function recenter() {
    tx.value = withTiming(0, { duration: 220 });
    ty.value = withTiming(0, { duration: 220 });
    scale.value = withTiming(1, { duration: 220 });
  }

  return (
    <View style={[styles.canvas, { width, height: CANVAS_H }]}>
      <GestureDetector gesture={canvasGesture}>
        <Animated.View style={styles.gestureLayer}>
          <Animated.View style={[{ position: "absolute", left: 0, top: 0, width, height: CANVAS_H }, worldStyle]}>
            {edges.map((e) => {
              const touches =
                selectedId != null && (e.from_thread_id === selectedId || e.to_thread_id === selectedId);
              const tier1 = e.connection_tier === 1;
              const dim = selectedId != null && !touches;
              const color = touches ? c.accentActive : tier1 ? c.textMuted : c.lineDefault;
              const thickness = touches ? 2 : tier1 ? 1.5 : 1;
              const opacity = touches ? 1 : dim ? 0.12 : tier1 ? 0.85 : 0.55;
              return (
                <MapEdge key={e.id} edge={e} positions={positions} color={color} thickness={thickness} opacity={opacity} />
              );
            })}

            {nodes.map((n) => {
              const lit = litSet.has(n.id);
              const sel = selectedId === n.id;
              const rec = (recommendedIds?.has(n.id) ?? false) && !sel && !lit;
              const visited = (visitedSet?.has(n.id) ?? false) && !lit;
              const dimmed = typeFilter != null && n.type !== typeFilter;
              const faded = selectedId != null && !sel && !(neighborSet?.has(n.id) ?? false);
              const known = lit || visited;
              const typeColor = TYPE_COLOR[n.type] ?? c.nodeDefault;
              const fill = sel ? c.accentActive : rec ? c.accentRecommend : known ? typeColor : "transparent";
              const border = sel ? c.accentActive : rec ? c.accentRecommend : typeColor;
              const labelColor = sel ? c.accentActive : known ? c.textMain : c.textMuted;
              const r = meta[n.id]?.r ?? DOT_BASE;
              const opacity = dimmed ? 0.18 : faded ? 0.26 : known ? 1 : 0.82;
              return (
                <MapNode
                  key={n.id}
                  node={n}
                  positions={positions}
                  scaleSV={scale}
                  draggingId={draggingId}
                  onEnergize={energize}
                  radius={r}
                  fill={fill}
                  border={border}
                  hollow={!sel && !rec && !known}
                  selected={sel}
                  labelColor={labelColor}
                  containerOpacity={opacity}
                  label={getThreadTranslation(n.id, locale).title}
                  onSelect={onSelect}
                  styles={styles}
                />
              );
            })}
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <View style={styles.controls} pointerEvents="box-none">
        <Pressable style={styles.ctrlBtn} onPress={() => zoom(1.3)} hitSlop={6}>
          <Text style={styles.ctrlText}>＋</Text>
        </Pressable>
        <Pressable style={styles.ctrlBtn} onPress={() => zoom(1 / 1.3)} hitSlop={6}>
          <Text style={styles.ctrlText}>－</Text>
        </Pressable>
        <Pressable style={[styles.ctrlBtn, styles.ctrlRecenter]} onPress={recenter} hitSlop={6}>
          <Text style={styles.ctrlText}>⌖</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ── 연결선: transform 전용(Fabric). 1px 바를 중심 기준 회전+가로 스케일 ──
function MapEdge({
  edge,
  positions,
  color,
  thickness,
  opacity,
}: {
  edge: ThreadConnection;
  positions: SharedValue<Record<string, Pos>>;
  color: string;
  thickness: number;
  opacity: number;
}) {
  const geom = useAnimatedStyle(() => {
    const a = positions.value[edge.from_thread_id];
    const b = positions.value[edge.to_thread_id];
    if (!a || !b) return { transform: [{ scaleX: 0 }] };
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    return {
      transform: [
        { translateX: mx - 0.5 },
        { translateY: my - thickness / 2 },
        { rotateZ: `${ang}rad` },
        { scaleX: len },
      ],
    };
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: "absolute", left: 0, top: 0, width: 1, height: thickness, backgroundColor: color, opacity }, geom]}
    />
  );
}

// ── 노드: 차수 기반 원(dot) + 줌 연동 라벨. 길게눌러 드래그(물리 재가열), 탭=선택 ──
function MapNode({
  node,
  positions,
  scaleSV,
  draggingId,
  onEnergize,
  radius: r,
  fill,
  border,
  hollow,
  selected,
  labelColor,
  containerOpacity,
  label,
  onSelect,
  styles,
}: {
  node: Thread;
  positions: SharedValue<Record<string, Pos>>;
  scaleSV: SharedValue<number>;
  draggingId: SharedValue<string | null>;
  onEnergize: () => void;
  radius: number;
  fill: string;
  border: string;
  hollow: boolean;
  selected: boolean;
  labelColor: string;
  containerOpacity: number;
  label: string;
  onSelect: (id: string) => void;
  styles: ReturnType<typeof makeStyles>;
}) {
  const start = useSharedValue<Pos>({ x: 0, y: 0 });

  // 컨테이너(폭 LABEL_W, 원이 상단)를 노드 좌표에 정렬: 원 중심이 (p.x, p.y).
  const aStyle = useAnimatedStyle(() => {
    const p = positions.value[node.id] ?? { x: 0, y: 0 };
    return { transform: [{ translateX: p.x - LABEL_W / 2 }, { translateY: p.y - r }] };
  });
  // 줌 아웃 시 라벨 페이드(선택 노드는 항상 표시).
  const labelStyle = useAnimatedStyle(() => {
    if (selected) return { opacity: 1 };
    let o = (scaleSV.value - 0.72) / 0.25;
    if (o < 0) o = 0;
    if (o > 1) o = 1;
    return { opacity: o };
  });

  const drag = Gesture.Pan()
    .activateAfterLongPress(180)
    .onStart(() => {
      const p = positions.value[node.id];
      if (p) start.value = p;
      draggingId.value = node.id;
      runOnJS(onEnergize)();
    })
    .onUpdate((e) => {
      const s = scaleSV.value || 1;
      positions.value = {
        ...positions.value,
        [node.id]: { x: start.value.x + e.translationX / s, y: start.value.y + e.translationY / s },
      };
    })
    .onEnd(() => {
      draggingId.value = null;
    });

  const tap = Gesture.Tap()
    .maxDistance(12)
    .onEnd(() => {
      runOnJS(onSelect)(node.id);
    });

  const gesture = Gesture.Exclusive(drag, tap);

  return (
    <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: LABEL_W, alignItems: "center", opacity: containerOpacity }, aStyle]}>
      <GestureDetector gesture={gesture}>
        <View style={{ width: LABEL_W, alignItems: "center" }}>
          <View
            style={{
              width: r * 2,
              height: r * 2,
              borderRadius: r,
              backgroundColor: fill,
              borderWidth: hollow ? 1.5 : selected ? 2 : 0,
              borderColor: border,
            }}
          />
          <Animated.View style={[{ marginTop: 4 }, labelStyle]}>
            <Text style={[styles.labelText, { color: labelColor, fontWeight: selected ? "700" : "600" }]} numberOfLines={1}>
              {label}
            </Text>
          </Animated.View>
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    canvas: { backgroundColor: c.bgMap, borderRadius: radius.lg, borderWidth: 1, borderColor: c.lineDefault, overflow: "hidden" },
    gestureLayer: { flex: 1 },
    labelText: { fontSize: font.tiny, maxWidth: LABEL_W, textAlign: "center" },
    controls: { position: "absolute", right: 10, bottom: 10, gap: 6, alignItems: "center" },
    ctrlBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.lineDefault,
      alignItems: "center",
      justifyContent: "center",
    },
    ctrlRecenter: { borderColor: c.accentActive },
    ctrlText: { color: c.textMain, fontSize: 16, fontWeight: "700", lineHeight: 18 },
  });

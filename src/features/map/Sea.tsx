import { useEffect, useMemo, useRef } from "react";
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
import { TYPE_GLYPH } from "./glyph";
import { computeLayout, type GraphLayoutMode, type Pos } from "./layout";

// Sea = Active Map. Obsidian식 유동 캔버스.
//  step1: 팬 / 핀치 줌(0.5~3x) / 노드 길게눌러 드래그 / ⊕⊖줌·⌖리센터 / 탭=선택.
//  step2: force 물리(척력+스프링+센터링) — useFrameCallback 으로 매 프레임 적분,
//         운동에너지 낮으면 자동 정지(settle), 드래그 시 해당 노드 고정+재가열.
//  노드 구성 = 분류 아이콘(흐리게) + 키워드 + 연결선. (저장됨 아이콘 없음.)
const NODE_W = 100;
const NODE_H = 44;
const CANVAS_H = 380;
const MAX_NODES = 12;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

// ── 물리 상수 (튜닝 포인트) ──
const IDEAL = 116; // 연결선 이상 길이
const REPULSION = 9000; // 노드 간 척력 세기
const SPRING = 0.05; // 연결선 스프링 강성
const CENTER = 0.015; // 중심으로 당기는 힘
const DAMPING = 0.8; // 감쇠(클수록 더 오래 움직임)
const MAX_SPEED = 36; // 프레임당 최대 속도
const SETTLE_KE = 0.4; // 이 운동에너지 미만이면 정지
const MAX_FRAMES = 600; // 안전 자동정지(~10s)
const MIN_DIST = 14;

function zeroVel(ids: string[]): Record<string, Pos> {
  const v: Record<string, Pos> = {};
  for (const id of ids) v[id] = { x: 0, y: 0 };
  return v;
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

  const nodes = useMemo(
    () => [...litThreads, ...fogThreads].slice(0, MAX_NODES),
    [litThreads, fogThreads],
  );
  const litSet = useMemo(() => new Set(litThreads.map((t) => t.id)), [litThreads]);
  const nodeIds = useMemo(() => new Set(nodes.map((n) => n.id)), [nodes]);

  const edges = useMemo(
    () => connections.filter((e) => nodeIds.has(e.from_thread_id) && nodeIds.has(e.to_thread_id)),
    [nodeIds],
  );

  // 선택은 시드(레이아웃)를 리셋하지 않도록 ref 로 캡처(탭마다 물리 재시작 방지).
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;
  // 시드 위치: 노드 집합 / 모드 / 폭 변할 때만 재계산.
  const seed = useMemo(
    () => computeLayout(layoutMode ?? "web", nodes, selectedRef.current, width, CANVAS_H),
    [nodes, layoutMode, width],
  );

  // 노드 위치/속도(물리). 단일 shared value 맵 → 노드+엣지가 같이 구독.
  const positions = useSharedValue<Record<string, Pos>>(seed);
  const velocities = useSharedValue<Record<string, Pos>>(zeroVel(nodes.map((n) => n.id)));
  const idsSV = useSharedValue<string[]>(nodes.map((n) => n.id));
  const edgesSV = useSharedValue<{ a: string; b: string }[]>(
    edges.map((e) => ({ a: e.from_thread_id, b: e.to_thread_id })),
  );
  const draggingId = useSharedValue<string | null>(null);
  const frameCount = useSharedValue(0);

  // ── force 시뮬레이션 (UI 스레드, 매 프레임) ──
  const frame = useFrameCallback((info) => {
    "worklet";
    const ids = idsSV.value;
    const eds = edgesSV.value;
    const n = ids.length;
    if (n < 2) return;
    const pos = positions.value;
    const vel = velocities.value;
    const dragId = draggingId.value;
    const dt = Math.min(Math.max((info.timeSincePreviousFrame ?? 16) / 16, 0.5), 2);

    const fx: Record<string, number> = {};
    const fy: Record<string, number> = {};
    for (let i = 0; i < n; i++) {
      fx[ids[i]] = 0;
      fy[ids[i]] = 0;
    }
    // 척력 (모든 쌍)
    for (let i = 0; i < n; i++) {
      const a = pos[ids[i]];
      for (let j = i + 1; j < n; j++) {
        const b = pos[ids[j]];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MIN_DIST) dist = MIN_DIST;
        const f = REPULSION / (dist * dist);
        const ux = dx / dist;
        const uy = dy / dist;
        fx[ids[i]] += ux * f;
        fy[ids[i]] += uy * f;
        fx[ids[j]] -= ux * f;
        fy[ids[j]] -= uy * f;
      }
    }
    // 스프링 (연결선)
    for (let k = 0; k < eds.length; k++) {
      const a = pos[eds[k].a];
      const b = pos[eds[k].b];
      if (!a || !b) continue;
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MIN_DIST) dist = MIN_DIST;
      const f = SPRING * (dist - IDEAL);
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
      fx[ids[i]] += (cx - p.x) * CENTER;
      fy[ids[i]] += (cy - p.y) * CENTER;
    }
    // 적분
    const newPos: Record<string, Pos> = {};
    const newVel: Record<string, Pos> = {};
    let ke = 0;
    for (let i = 0; i < n; i++) {
      const id = ids[i];
      const p = pos[id];
      const v = vel[id] ?? { x: 0, y: 0 };
      if (id === dragId) {
        newPos[id] = { x: p.x, y: p.y };
        newVel[id] = { x: 0, y: 0 };
        continue;
      }
      let vx = (v.x + fx[id] * dt) * DAMPING;
      let vy = (v.y + fy[id] * dt) * DAMPING;
      const sp = Math.sqrt(vx * vx + vy * vy);
      if (sp > MAX_SPEED) {
        vx = (vx / sp) * MAX_SPEED;
        vy = (vy / sp) * MAX_SPEED;
      }
      newVel[id] = { x: vx, y: vy };
      newPos[id] = { x: p.x + vx * dt, y: p.y + vy * dt };
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

  // 시드(노드/모드/폭) 바뀌면 위치·속도 리셋 후 재가열.
  useEffect(() => {
    const ids = nodes.map((n) => n.id);
    positions.value = seed;
    velocities.value = zeroVel(ids);
    idsSV.value = ids;
    edgesSV.value = edges.map((e) => ({ a: e.from_thread_id, b: e.to_thread_id }));
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
    scale.value = withTiming(Math.min(Math.max(scale.value * factor, MIN_SCALE), MAX_SCALE), {
      duration: 160,
    });
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
              const base = e.connection_tier === 2 ? c.textMuted : c.lineDefault;
              return (
                <MapEdge
                  key={e.id}
                  edge={e}
                  positions={positions}
                  emphasized={touches}
                  dim={selectedId != null && !touches}
                  base={base}
                  accent={c.accentActive}
                />
              );
            })}

            {nodes.map((n) => {
              const lit = litSet.has(n.id);
              const sel = selectedId === n.id;
              const rec = (recommendedIds?.has(n.id) ?? false) && !sel && !lit;
              const visited = (visitedSet?.has(n.id) ?? false) && !sel && !lit;
              const dimmed = typeFilter != null && n.type !== typeFilter;
              const focusGlyph = sel || rec; // 선택/추천만 또렷, 나머지 분류아이콘은 흐리게
              const color = rec ? c.accentRecommend : sel ? c.accentActive : c.textMuted;
              return (
                <MapNode
                  key={n.id}
                  node={n}
                  positions={positions}
                  scaleSV={scale}
                  draggingId={draggingId}
                  onEnergize={energize}
                  selected={sel}
                  lit={lit}
                  visited={visited}
                  dimmed={dimmed}
                  glyphColor={color}
                  glyphOpacity={focusGlyph ? 1 : 0.4}
                  label={getThreadTranslation(n.id, locale).title}
                  onSelect={onSelect}
                  styles={styles}
                />
              );
            })}
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      {/* 컨트롤 오버레이 (변환 영향 없음) */}
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

// ── 연결선: 두 노드 위치(shared)에서 기하 계산, 물리/드래그 시 실시간 추종 ──
function MapEdge({
  edge,
  positions,
  emphasized,
  dim,
  base,
  accent,
}: {
  edge: ThreadConnection;
  positions: SharedValue<Record<string, Pos>>;
  emphasized: boolean;
  dim: boolean;
  base: string;
  accent: string;
}) {
  const geom = useAnimatedStyle(() => {
    const a = positions.value[edge.from_thread_id];
    const b = positions.value[edge.to_thread_id];
    if (!a || !b) return { opacity: 0 };
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    const ang = Math.atan2(dy, dx);
    return {
      left: (a.x + b.x) / 2 - len / 2,
      top: (a.y + b.y) / 2,
      width: len,
      transform: [{ rotateZ: `${ang}rad` }],
    };
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          height: emphasized ? 2 : 1,
          backgroundColor: emphasized ? accent : base,
          opacity: emphasized ? 1 : dim ? 0.25 : 1,
        },
        geom,
      ]}
    />
  );
}

// ── 노드: 분류 아이콘(흐리게) + 키워드. 길게눌러 드래그(물리 재가열), 탭=선택 ──
function MapNode({
  node,
  positions,
  scaleSV,
  draggingId,
  onEnergize,
  selected,
  lit,
  visited,
  dimmed,
  glyphColor,
  glyphOpacity,
  label,
  onSelect,
  styles,
}: {
  node: Thread;
  positions: SharedValue<Record<string, Pos>>;
  scaleSV: SharedValue<number>;
  draggingId: SharedValue<string | null>;
  onEnergize: () => void;
  selected: boolean;
  lit: boolean;
  visited: boolean;
  dimmed: boolean;
  glyphColor: string;
  glyphOpacity: number;
  label: string;
  onSelect: (id: string) => void;
  styles: ReturnType<typeof makeStyles>;
}) {
  const start = useSharedValue<Pos>({ x: 0, y: 0 });

  const aStyle = useAnimatedStyle(() => {
    const p = positions.value[node.id] ?? { x: 0, y: 0 };
    return { transform: [{ translateX: p.x - NODE_W / 2 }, { translateY: p.y - NODE_H / 2 }] };
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
    <Animated.View
      style={[
        { position: "absolute", left: 0, top: 0, width: NODE_W, alignItems: "center", opacity: dimmed ? 0.25 : visited ? 0.6 : 1 },
        aStyle,
      ]}
    >
      <GestureDetector gesture={gesture}>
        <View style={{ width: NODE_W, alignItems: "center" }}>
          <Text style={[styles.glyph, { color: glyphColor, opacity: glyphOpacity }]}>{TYPE_GLYPH[node.type]}</Text>
          <View style={[styles.label, selected && styles.labelSel]}>
            <Text style={[styles.labelText, selected && styles.labelTextSel]} numberOfLines={1}>
              {label}
            </Text>
          </View>
          {!lit && !visited && <Text style={styles.fogSub}>미발견</Text>}
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    canvas: { backgroundColor: c.bgMap, borderRadius: radius.lg, borderWidth: 1, borderColor: c.lineDefault, overflow: "hidden" },
    gestureLayer: { flex: 1 },
    glyph: { fontSize: 18, lineHeight: 20, marginBottom: 1 },
    label: { borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 1, maxWidth: NODE_W },
    labelSel: { backgroundColor: c.accentActive },
    labelText: { color: c.textMain, fontSize: font.tiny, fontWeight: "600" },
    labelTextSel: { color: c.onAccent },
    fogSub: { color: c.textMuted, fontSize: 9, marginTop: 1, opacity: 0.7 },
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

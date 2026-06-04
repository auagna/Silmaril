import { useEffect, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
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

// Sea = Active Map. Obsidian식 유동 캔버스(PHASE 49 step1):
//  · 한 손가락 팬 / 두 손가락 핀치 확대축소(0.5~3x, 중심 기준)
//  · 노드 길게눌러(180ms) 드래그 → 연결선이 실시간으로 따라옴
//  · 우하단 ⊕⊖ 줌 / ⌖ 리센터 버튼
//  · 탭 = 선택. (2단계에서 force 물리 얹을 예정.)
const NODE_W = 100;
const NODE_H = 44;
const CANVAS_H = 380;
const MAX_NODES = 12;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

function clampW(v: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(v, min), max);
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

  const layout = useMemo(
    () => computeLayout(layoutMode ?? "web", nodes, selectedId, width, CANVAS_H),
    [layoutMode, nodes, selectedId, width],
  );

  const edges = useMemo(
    () => connections.filter((e) => nodeIds.has(e.from_thread_id) && nodeIds.has(e.to_thread_id)),
    [nodeIds],
  );

  // 노드 위치(드래그로 변함). 단일 shared value 맵 → 노드+연결선이 같이 구독.
  const positions = useSharedValue<Record<string, Pos>>(layout);
  // 레이아웃(모드/데이터/선택) 바뀌면 위치 리셋.
  useEffect(() => {
    positions.value = layout;
  }, [layout, positions]);

  // 캔버스 변환(팬/줌).
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
      scale.value = clampW(sScale.value * e.scale, MIN_SCALE, MAX_SCALE);
    });

  const canvasGesture = Gesture.Simultaneous(pan, pinch);

  // 중심(cx,cy) 기준 스케일: T(t) · T(c) · S · T(-c)
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
              const color = rec ? c.accentRecommend : sel ? c.accentActive : lit ? c.nodeDefault : c.textMuted;
              return (
                <MapNode
                  key={n.id}
                  node={n}
                  positions={positions}
                  scaleSV={scale}
                  selected={sel}
                  lit={lit}
                  rec={rec}
                  visited={visited}
                  dimmed={dimmed}
                  glyphColor={color}
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

// ── 연결선: 두 노드 위치(shared)에서 기하 계산, 드래그 시 실시간 추종 ──
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

// ── 노드: 위치(shared)로 배치, 길게눌러 드래그, 탭=선택 ──
function MapNode({
  node,
  positions,
  scaleSV,
  selected,
  lit,
  rec,
  visited,
  dimmed,
  glyphColor,
  label,
  onSelect,
  styles,
}: {
  node: Thread;
  positions: SharedValue<Record<string, Pos>>;
  scaleSV: SharedValue<number>;
  selected: boolean;
  lit: boolean;
  rec: boolean;
  visited: boolean;
  dimmed: boolean;
  glyphColor: string;
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
    })
    .onUpdate((e) => {
      const s = scaleSV.value || 1;
      positions.value = {
        ...positions.value,
        [node.id]: { x: start.value.x + e.translationX / s, y: start.value.y + e.translationY / s },
      };
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
          <Text style={[styles.glyph, { color: glyphColor }]}>{rec ? "★" : TYPE_GLYPH[node.type]}</Text>
          <View style={[styles.label, selected && styles.labelSel]}>
            <Text style={[styles.labelText, selected && styles.labelTextSel]} numberOfLines={1}>
              {lit ? "🔖 " : ""}
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

import { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import type { Thread, ThreadType } from "@/types/database";
import { connections, getThreadTranslation } from "@/lib/dummy";
import { useTheme, radius, font, type Palette } from "@/theme";
import { useLocale } from "@/i18n";
import { TYPE_GLYPH } from "./glyph";
import { computeLayout, type GraphLayoutMode } from "./layout";

// Sea = Active Map. 경량 별자리(노드+연결). svg 없이 RN View 라인.
// 노드: 일반=nodeDefault / 선택=accentActive / 추천=accentRecommend. 미발견=점선.
const NODE_W = 100;
const NODE_H = 44;
const CANVAS_H = 380;

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
  const nodes = useMemo(() => [...litThreads, ...fogThreads].slice(0, 8), [litThreads, fogThreads]);
  const litSet = useMemo(() => new Set(litThreads.map((t) => t.id)), [litThreads]);

  const pos = useMemo(
    () => computeLayout(layoutMode ?? "web", nodes, selectedId, width, CANVAS_H),
    [layoutMode, nodes, selectedId, width],
  );

  const edges = useMemo(
    () => connections.filter((e) => pos[e.from_thread_id] && pos[e.to_thread_id]),
    [pos],
  );

  return (
    <View style={[styles.canvas, { width, height: CANVAS_H }]}>
      {edges.map((e) => {
        const a = pos[e.from_thread_id];
        const b = pos[e.to_thread_id];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy);
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        // PHASE 31: 선택 노드의 관계만 강조, 나머지 흐리게. tier2(해석)=옅은 색.
        const touches = selectedId != null && (e.from_thread_id === selectedId || e.to_thread_id === selectedId);
        const base = e.connection_tier === 2 ? c.textMuted : c.lineDefault;
        return (
          <View
            key={e.id}
            style={{
              position: "absolute",
              left: (a.x + b.x) / 2 - len / 2,
              top: (a.y + b.y) / 2,
              width: len,
              height: touches ? 2 : 1,
              backgroundColor: touches ? c.accentActive : base,
              opacity: selectedId != null && !touches ? 0.25 : 1,
              transform: [{ rotateZ: `${ang}deg` }],
            }}
          />
        );
      })}

      {nodes.map((n) => {
        const p = pos[n.id];
        const lit = litSet.has(n.id);
        const sel = selectedId === n.id;
        const rec = (recommendedIds?.has(n.id) ?? false) && !sel && !lit;
        const visited = (visitedSet?.has(n.id) ?? false) && !sel && !lit;
        const dimmed = typeFilter != null && n.type !== typeFilter; // 타입 필터 비강조
        return (
          <Pressable
            key={n.id}
            onPress={() => onSelect(n.id)}
            hitSlop={10}
            style={{
              position: "absolute",
              left: p.x - NODE_W / 2,
              top: p.y - NODE_H / 2,
              width: NODE_W,
              alignItems: "center",
              opacity: dimmed ? 0.25 : visited ? 0.6 : 1,
            }}
          >
            {/* 아이콘 = 무엇인지(타입), ★ = 추천 */}
            <Text
              style={[
                styles.glyph,
                { color: rec ? c.accentRecommend : sel ? c.accentActive : lit ? c.nodeDefault : c.textMuted },
              ]}
            >
              {rec ? "★" : TYPE_GLYPH[n.type]}
            </Text>
            {/* 라벨 = 이름. 선택 시 capsule. */}
            <View style={[styles.label, sel && styles.labelSel]}>
              <Text style={[styles.labelText, sel && styles.labelTextSel]} numberOfLines={1}>
                {lit ? "🔖 " : ""}
                {getThreadTranslation(n.id, locale).title}
              </Text>
            </View>
            {!lit && !visited && <Text style={styles.fogSub}>미발견</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    canvas: { backgroundColor: c.bgMap, borderRadius: radius.lg, borderWidth: 1, borderColor: c.lineDefault, overflow: "hidden" },
    glyph: { fontSize: 18, lineHeight: 20, marginBottom: 1 },
    label: { borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 1, maxWidth: NODE_W },
    labelSel: { backgroundColor: c.accentActive },
    labelText: { color: c.textMain, fontSize: font.tiny, fontWeight: "600" },
    labelTextSel: { color: c.onAccent },
    fogSub: { color: c.textMuted, fontSize: 9, marginTop: 1, opacity: 0.7 },
  });

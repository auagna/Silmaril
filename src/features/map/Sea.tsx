import { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import type { Thread } from "@/types/database";
import { connections, getThreadTranslation } from "@/lib/dummy";
import { useTheme, radius, font, type Palette } from "@/theme";
import { useLocale } from "@/i18n";

// Sea = Active Map. 경량 별자리(노드+연결). svg 없이 RN View 라인.
// 노드: 일반=nodeDefault / 선택=accentActive / 추천=accentRecommend. 미발견=점선.
const NODE_W = 100;
const NODE_H = 34;
const CANVAS_H = 380;

export function Sea({
  litThreads,
  fogThreads,
  selectedId,
  recommendedId,
  onSelect,
}: {
  litThreads: Thread[];
  fogThreads: Thread[];
  selectedId: string | null;
  recommendedId?: string | null;
  onSelect: (id: string) => void;
}) {
  const c = useTheme().colors;
  const { locale } = useLocale();
  const styles = useMemo(() => makeStyles(c), [c]);
  const width = Dimensions.get("window").width - 32;
  const nodes = useMemo(() => [...litThreads, ...fogThreads].slice(0, 8), [litThreads, fogThreads]);
  const litSet = useMemo(() => new Set(litThreads.map((t) => t.id)), [litThreads]);

  const pos = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    const cx = width / 2;
    const cy = CANVAS_H / 2;
    const r = Math.min(width, CANVAS_H) / 2 - 64;
    nodes.forEach((n, i) => {
      if (i === 0) map[n.id] = { x: cx, y: cy };
      else {
        const a = (2 * Math.PI * (i - 1)) / Math.max(1, nodes.length - 1) - Math.PI / 2;
        map[n.id] = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
      }
    });
    return map;
  }, [nodes, width]);

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
        return (
          <View
            key={e.id}
            style={{
              position: "absolute",
              left: (a.x + b.x) / 2 - len / 2,
              top: (a.y + b.y) / 2,
              width: len,
              height: 1,
              backgroundColor: e.connection_tier === 2 ? c.textMuted : c.lineDefault,
              transform: [{ rotateZ: `${ang}deg` }],
            }}
          />
        );
      })}

      {nodes.map((n) => {
        const p = pos[n.id];
        const lit = litSet.has(n.id);
        const sel = selectedId === n.id;
        const rec = recommendedId === n.id;
        return (
          <Pressable
            key={n.id}
            onPress={() => onSelect(n.id)}
            hitSlop={10}
            style={{ position: "absolute", left: p.x - NODE_W / 2, top: p.y - NODE_H / 2, width: NODE_W, alignItems: "center" }}
          >
            <View
              style={[
                styles.node,
                lit ? styles.lit : styles.fog,
                rec && styles.rec,
                sel && styles.sel,
              ]}
            >
              <Text style={lit || sel || rec ? styles.litText : styles.fogText} numberOfLines={1}>
                {getThreadTranslation(n.id, locale).title}
              </Text>
            </View>
            {!lit && <Text style={styles.fogSub}>미발견</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    canvas: { backgroundColor: c.bgMap, borderRadius: radius.lg, borderWidth: 1, borderColor: c.lineDefault, overflow: "hidden" },
    node: { height: NODE_H, paddingHorizontal: 12, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", maxWidth: NODE_W },
    lit: { backgroundColor: c.nodeDefault },
    fog: { backgroundColor: "transparent", borderWidth: 1, borderColor: c.lineDefault, borderStyle: "dashed" },
    rec: { backgroundColor: c.accentRecommend, borderWidth: 0 },
    sel: { backgroundColor: c.accentActive, borderWidth: 0 },
    litText: { color: c.nodeText, fontSize: font.small, fontWeight: "700" },
    fogText: { color: c.textMuted, fontSize: font.small },
    fogSub: { color: c.textMuted, fontSize: 9, marginTop: 2, opacity: 0.7 },
  });

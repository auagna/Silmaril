import { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import type { Thread } from "@/types/database";
import { connections } from "@/lib/dummy";
import { colors, radius, font } from "@/constants/theme";

// Sea = Active Map. 경량 별자리(노드+연결). svg 없이 RN View 라인.
// 사용자 용어: 밝혀진 실마리 / 새로운 흔적(미발견). (???/Fog/Locked 금지)
const NODE_W = 100;
const NODE_H = 34;
const CANVAS_H = 380;

export function Sea({
  litThreads,
  fogThreads,
  selectedId,
  onSelect,
}: {
  litThreads: Thread[];
  fogThreads: Thread[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const width = Dimensions.get("window").width - 32;
  const nodes = useMemo(() => [...litThreads, ...fogThreads].slice(0, 8), [litThreads, fogThreads]);
  const litSet = useMemo(() => new Set(litThreads.map((t) => t.id)), [litThreads]);

  const pos = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    const cx = width / 2;
    const cy = CANVAS_H / 2;
    const r = Math.min(width, CANVAS_H) / 2 - 64;
    nodes.forEach((n, i) => {
      if (i === 0) {
        map[n.id] = { x: cx, y: cy };
      } else {
        const a = (2 * Math.PI * (i - 1)) / Math.max(1, nodes.length - 1) - Math.PI / 2;
        map[n.id] = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
      }
    });
    return map;
  }, [nodes, width]);

  const edges = useMemo(
    () => connections.filter((c) => pos[c.from_thread_id] && pos[c.to_thread_id]),
    [pos],
  );

  return (
    <View style={[styles.canvas, { width, height: CANVAS_H }]}>
      {/* 연결선 */}
      {edges.map((c) => {
        const a = pos[c.from_thread_id];
        const b = pos[c.to_thread_id];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy);
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        return (
          <View
            key={c.id}
            style={{
              position: "absolute",
              left: (a.x + b.x) / 2 - len / 2,
              top: (a.y + b.y) / 2,
              width: len,
              height: 1,
              backgroundColor: c.connection_tier === 2 ? colors.accent : colors.atlasLine,
              opacity: c.connection_tier === 2 ? 0.7 : 1,
              transform: [{ rotateZ: `${ang}deg` }],
            }}
          />
        );
      })}

      {/* 노드 */}
      {nodes.map((n) => {
        const p = pos[n.id];
        const lit = litSet.has(n.id);
        const sel = selectedId === n.id;
        return (
          <Pressable
            key={n.id}
            onPress={() => onSelect(n.id)}
            style={{ position: "absolute", left: p.x - NODE_W / 2, top: p.y - NODE_H / 2, width: NODE_W, alignItems: "center" }}
          >
            <View style={[styles.node, lit ? styles.lit : styles.fog, sel && styles.sel]}>
              <Text style={lit ? styles.litText : styles.fogText} numberOfLines={1}>
                {n.title}
              </Text>
            </View>
            {!lit && <Text style={styles.fogSub}>미발견</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: colors.atlasBg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.atlasLine,
    overflow: "hidden",
  },
  node: {
    height: NODE_H,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: NODE_W,
  },
  lit: {
    backgroundColor: colors.atlasText,
    shadowColor: colors.atlasGlow,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  fog: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.atlasLine,
    borderStyle: "dashed",
  },
  sel: { borderWidth: 2, borderColor: colors.atlasGlow, borderStyle: "solid" },
  litText: { color: colors.atlasBg, fontSize: font.small, fontWeight: "700" },
  fogText: { color: colors.atlasMut, fontSize: font.small },
  fogSub: { color: "#5b6577", fontSize: 9, marginTop: 2 },
});

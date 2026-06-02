import { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sea } from "@/features/map/Sea";
import { LandSheet } from "@/features/map/LandSheet";
import { useSaves } from "@/features/saves/store";
import { threads, getThreadById, undiscovered, exploreProgress } from "@/lib/dummy";
import { colors, space, radius, font } from "@/constants/theme";

// Map = 핵심 경험. Sky(나침반) / Sea(Active Map) / Land(상세 시트). (D-017)
export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { savedSet } = useSaves();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const litThreads = threads.filter((t) => savedSet.has(t.id));
  const fogThreads = undiscovered();
  const heroId = "ando-tadao";
  const firstFog = fogThreads[0]?.id ?? heroId;

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.md }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sky — 나침반 */}
        <Text style={styles.wordmark}>Silmaril</Text>
        <Text style={styles.subtitle}>내 세계를 밝히는 중</Text>

        <View style={styles.compass}>
          <Pressable style={styles.chip} onPress={() => setSelectedId(heroId)}>
            <Text style={styles.chipText}>오늘의 발견</Text>
          </Pressable>
          <Pressable style={styles.chip} onPress={() => setSelectedId("dieter-rams")}>
            <Text style={styles.chipText}>추천</Text>
          </Pressable>
          <Pressable style={styles.chip} onPress={() => setSelectedId(firstFog)}>
            <Text style={styles.chipText}>새로운 흔적 {fogThreads.length}</Text>
          </Pressable>
        </View>

        {/* 탐험률 */}
        <View style={styles.progress}>
          {exploreProgress.map((p) => (
            <View key={p.label} style={styles.progRow}>
              <Text style={styles.progLabel}>{p.label}</Text>
              <View style={styles.track}><View style={[styles.fill, { width: `${p.pct}%` }]} /></View>
              <Text style={styles.progPct}>{p.pct}%</Text>
            </View>
          ))}
        </View>

        {/* Sea — Active Map */}
        <Sea litThreads={litThreads} fogThreads={fogThreads} selectedId={selectedId} onSelect={setSelectedId} />
        <Text style={styles.hint}>노드를 눌러 실마리를 펼치고, 연결을 따라가 보세요.</Text>
      </ScrollView>

      {/* Land — 상세 시트 */}
      <LandSheet threadId={selectedId} onClose={() => setSelectedId(null)} onSelectThread={(id) => setSelectedId(id)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.atlasBg },
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxl },
  wordmark: { color: colors.atlasText, fontSize: font.h1, fontWeight: "700", letterSpacing: -0.3 },
  subtitle: { color: colors.atlasMut, fontSize: font.small, marginTop: 2 },
  compass: { flexDirection: "row", gap: space.sm, marginTop: space.md },
  chip: {
    backgroundColor: colors.atlasSurface, borderWidth: 1, borderColor: colors.atlasLine,
    borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7,
  },
  chipText: { color: colors.atlasText, fontSize: font.small, fontWeight: "600" },
  progress: { marginTop: space.lg, marginBottom: space.md, gap: space.sm },
  progRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
  progLabel: { color: colors.atlasMut, fontSize: font.small, width: 84 },
  track: { flex: 1, height: 6, backgroundColor: colors.atlasSurface, borderRadius: 6, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: colors.atlasGlow, borderRadius: 6 },
  progPct: { color: colors.atlasText, fontSize: font.tiny, width: 34, textAlign: "right" },
  hint: { color: colors.atlasMut, fontSize: font.small, textAlign: "center", marginTop: space.md },
});

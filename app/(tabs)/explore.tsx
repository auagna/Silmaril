import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSaves } from "@/features/saves/store";
import { threads, getThreadById, undiscovered, exploreProgress } from "@/lib/dummy";
import { colors, space, radius, font } from "@/constants/theme";

// Atlas(내부 개념) = 사용자에겐 '탐험'. 어두운 세계를 저장으로 밝힌다.
// 키워드 탭 + 가로 스와이프. 미지영역은 '미발견 / 새로운 흔적' (??? / Fog / Locked 금지).
export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { savedSet } = useSaves();

  const concepts = ["light", "silence", "phenomenology"].map((id) => getThreadById(id)!);
  const savedThreads = threads.filter((t) => savedSet.has(t.id));
  const traces = undiscovered();

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.md }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>탐험</Text>
        <Text style={styles.title}>내 세계를 밝히는 중</Text>

        {/* 진행률 */}
        <View style={styles.progressWrap}>
          {exploreProgress.map((p) => (
            <View key={p.label} style={styles.progressRow}>
              <Text style={styles.progressLabel}>{p.label}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${p.pct}%` }]} />
              </View>
              <Text style={styles.progressPct}>{p.pct}%</Text>
            </View>
          ))}
        </View>

        {/* 키워드 — 탭 + 스와이프 */}
        <Text style={styles.sectionLbl}>키워드를 따라가 보세요</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
          {concepts.map((c) => (
            <Pressable key={c.id} onPress={() => router.push(`/thread/${c.slug}`)} style={styles.keyword}>
              <Text style={styles.keywordText}>{c.title}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* 밝혀진 노드(저장) */}
        <Text style={styles.sectionLbl}>밝혀진 실마리 · {savedThreads.length}</Text>
        <View style={styles.nodeWrap}>
          {savedThreads.map((t) => (
            <Pressable key={t.id} onPress={() => router.push(`/thread/${t.slug}`)} style={styles.node}>
              <Text style={styles.nodeText}>{t.title}</Text>
            </Pressable>
          ))}
        </View>

        {/* 미발견 (절대 ??? / Fog / Locked 아님) */}
        <Text style={styles.sectionLbl}>새로운 흔적 · {traces.length}</Text>
        <Text style={styles.hint}>저장한 실마리들이 가리키는, 아직 가보지 않은 곳.</Text>
        <View style={styles.nodeWrap}>
          {traces.map((t) => (
            <Pressable key={t.id} onPress={() => router.push(`/thread/${t.slug}`)} style={styles.trace}>
              <Text style={styles.traceText}>{t.title}</Text>
              <Text style={styles.traceSub}>미발견</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.atlasBg },
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxl },
  eyebrow: { color: colors.atlasMut, fontSize: font.small, letterSpacing: 1 },
  title: { color: colors.atlasText, fontSize: font.h1, fontWeight: "700", marginTop: 2, letterSpacing: -0.3 },

  progressWrap: { marginTop: space.lg, gap: space.sm },
  progressRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
  progressLabel: { color: colors.atlasMut, fontSize: font.small, width: 84 },
  progressTrack: { flex: 1, height: 6, backgroundColor: colors.atlasSurface, borderRadius: 6, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: colors.atlasGlow, borderRadius: 6 },
  progressPct: { color: colors.atlasText, fontSize: font.tiny, width: 34, textAlign: "right" },

  sectionLbl: {
    color: colors.atlasMut, fontSize: font.tiny, fontWeight: "700", letterSpacing: 0.6,
    textTransform: "uppercase", marginTop: space.xl, marginBottom: space.sm,
  },
  hint: { color: colors.atlasMut, fontSize: font.small, marginBottom: space.sm },

  keyword: {
    backgroundColor: colors.atlasText, borderRadius: radius.pill, paddingHorizontal: space.lg, paddingVertical: space.sm,
  },
  keywordText: { color: colors.atlasBg, fontWeight: "700", fontSize: font.body },

  nodeWrap: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  node: {
    backgroundColor: colors.atlasSurface, borderWidth: 1, borderColor: colors.atlasLine,
    borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9,
    shadowColor: colors.atlasGlow, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 0 },
  },
  nodeText: { color: colors.atlasText, fontSize: font.small, fontWeight: "600" },
  trace: {
    borderWidth: 1, borderColor: colors.atlasLine, borderStyle: "dashed", borderRadius: radius.pill,
    paddingHorizontal: 14, paddingVertical: 9, alignItems: "center",
  },
  traceText: { color: colors.atlasMut, fontSize: font.small },
  traceSub: { color: "#5b6577", fontSize: 9, marginTop: 1 },
});

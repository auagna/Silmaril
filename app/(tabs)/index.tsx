import { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sea } from "@/features/map/Sea";
import { LandSheet } from "@/features/map/LandSheet";
import { useSaves } from "@/features/saves/store";
import { threads, undiscovered, exploreProgress } from "@/lib/dummy";
import { useTheme, space, radius, font, type Palette } from "@/theme";

// Map = 핵심 경험. Sky(나침반) / Sea(Active Map) / Land(상세 시트). (D-017)
export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const c = useTheme().colors;
  const styles = useMemo(() => makeStyles(c), [c]);
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

        <View style={styles.progress}>
          {exploreProgress.map((p) => (
            <View key={p.label} style={styles.progRow}>
              <Text style={styles.progLabel}>{p.label}</Text>
              <View style={styles.track}><View style={[styles.fill, { width: `${p.pct}%` }]} /></View>
              <Text style={styles.progPct}>{p.pct}%</Text>
            </View>
          ))}
        </View>

        <Sea litThreads={litThreads} fogThreads={fogThreads} selectedId={selectedId} onSelect={setSelectedId} />
        <Text style={styles.hint}>노드를 눌러 실마리를 펼치고, 연결을 따라가 보세요.</Text>
      </ScrollView>

      <LandSheet threadId={selectedId} onClose={() => setSelectedId(null)} onSelectThread={(id) => setSelectedId(id)} />
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgMain },
    content: { paddingHorizontal: space.lg, paddingBottom: space.xxl },
    wordmark: { color: c.textMain, fontSize: font.h1, fontWeight: "700", letterSpacing: -0.3 },
    subtitle: { color: c.textMuted, fontSize: font.small, marginTop: 2 },
    compass: { flexDirection: "row", gap: space.sm, marginTop: space.md },
    chip: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.lineDefault, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7 },
    chipText: { color: c.textMain, fontSize: font.small, fontWeight: "600" },
    progress: { marginTop: space.lg, marginBottom: space.md, gap: space.sm },
    progRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
    progLabel: { color: c.textMuted, fontSize: font.small, width: 84 },
    track: { flex: 1, height: 6, backgroundColor: c.line2, borderRadius: 6, overflow: "hidden" },
    fill: { height: "100%", backgroundColor: c.nodeDefault, borderRadius: 6 },
    progPct: { color: c.textMain, fontSize: font.tiny, width: 34, textAlign: "right" },
    hint: { color: c.textMuted, fontSize: font.small, textAlign: "center", marginTop: space.md },
  });

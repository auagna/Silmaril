import { useMemo } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sea } from "@/features/map/Sea";
import { LandSheet } from "@/features/map/LandSheet";
import { useSaves } from "@/features/saves/store";
import { useExplore } from "@/features/explore/store";
import { recommendNext } from "@/features/explore/recommend";
import { threads, undiscovered, exploreProgress, recommendedIds } from "@/lib/dummy";
import { useTheme, space, radius, font, type Palette } from "@/theme";
import { useLocale } from "@/i18n";

const RECOMMENDED = new Set(recommendedIds);

// Map = 핵심 경험. Sky(나침반) / Sea(Active Map) / Land(상세 시트). (D-017)
export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useTheme().colors;
  const { t } = useLocale();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { savedSet } = useSaves();
  const { selectedId, setSelected, visitedSet } = useExplore();

  const litThreads = threads.filter((th) => savedSet.has(th.id));
  const fogThreads = undiscovered();
  const heroId = "tadao-ando";
  const firstFog = fogThreads[0]?.id ?? heroId;

  function select(id: string) {
    setSelected(id);
  }
  function handleRecommend() {
    const next = recommendNext(selectedId, visitedSet);
    if (next) select(next);
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.md }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sky — 나침반 */}
        <View style={styles.skyTop}>
          <View>
            <Text style={styles.wordmark}>Silmaril</Text>
            <Text style={styles.subtitle}>{t("illuminating")}</Text>
          </View>
          <Pressable style={styles.searchBtn} onPress={() => router.push("/search")} hitSlop={8}>
            <Text style={styles.searchIcon}>⌕</Text>
          </Pressable>
        </View>

        <View style={styles.compass}>
          <Pressable style={styles.chip} onPress={() => select(heroId)}>
            <Text style={styles.chipText}>{t("today")}</Text>
          </Pressable>
          <Pressable style={[styles.chip, styles.chipStar]} onPress={handleRecommend}>
            <Text style={styles.chipStarText}>★ {t("recommend")}</Text>
          </Pressable>
          <Pressable style={styles.chip} onPress={() => select(firstFog)}>
            <Text style={styles.chipText}>{t("newTraces")} {fogThreads.length}</Text>
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

        <Sea
          litThreads={litThreads}
          fogThreads={fogThreads}
          selectedId={selectedId}
          recommendedIds={RECOMMENDED}
          visitedSet={visitedSet}
          onSelect={select}
        />
        <Text style={styles.hint}>{t("mapHint")}</Text>
      </ScrollView>

      <LandSheet threadId={selectedId} onClose={() => setSelected(null)} onSelectThread={(id) => select(id)} />
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgMain },
    content: { paddingHorizontal: space.lg, paddingBottom: space.xxl },
    skyTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    wordmark: { color: c.textMain, fontSize: font.h1, fontWeight: "700", letterSpacing: -0.3 },
    subtitle: { color: c.textMuted, fontSize: font.small, marginTop: 2 },
    searchBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: c.lineDefault, alignItems: "center", justifyContent: "center", backgroundColor: c.surface },
    searchIcon: { color: c.textMain, fontSize: 18 },
    compass: { flexDirection: "row", gap: space.sm, marginTop: space.md },
    chip: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.lineDefault, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7 },
    chipText: { color: c.textMain, fontSize: font.small, fontWeight: "600" },
    chipStar: { borderColor: c.accentRecommend },
    chipStarText: { color: c.accentRecommend, fontSize: font.small, fontWeight: "700" },
    progress: { marginTop: space.lg, marginBottom: space.md, gap: space.sm },
    progRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
    progLabel: { color: c.textMuted, fontSize: font.small, width: 84 },
    track: { flex: 1, height: 6, backgroundColor: c.line2, borderRadius: 6, overflow: "hidden" },
    fill: { height: "100%", backgroundColor: c.nodeDefault, borderRadius: 6 },
    progPct: { color: c.textMain, fontSize: font.tiny, width: 34, textAlign: "right" },
    hint: { color: c.textMuted, fontSize: font.small, textAlign: "center", marginTop: space.md },
  });

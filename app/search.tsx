import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchThreads, getThreadTranslation } from "@/lib/dummy";
import { threadTypeLabel } from "@/types/database";
import { useExplore } from "@/features/explore/store";
import { useTheme, space, radius, font, type Palette } from "@/theme";
import { useLocale } from "@/i18n";

// PHASE 35 — 검색/자동완성. canonicalTitle + 번역(title/summary) 검색, locale 표시.
export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useTheme().colors;
  const { t, locale } = useLocale();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { setSelected } = useExplore();
  const [q, setQ] = useState("");

  const results = useMemo(() => (q.trim() === "" ? [] : searchThreads(q)), [q]);

  function pick(id: string) {
    setSelected(id); // Map의 selectedKeyword 변경
    router.back(); // Map 으로 복귀 (focus)
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.sm }]}>
      <View style={styles.bar}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.cancel}>←</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          value={q}
          onChangeText={setQ}
          placeholder={t("searchPlaceholder")}
          placeholderTextColor={c.textMuted}
          autoFocus
          autoCapitalize="none"
        />
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: space.lg }}>
        {q.trim() !== "" && results.length === 0 && (
          <View style={{ alignItems: "center", marginTop: space.xl, gap: space.md }}>
            <Text style={styles.muted}>{t("noResults")}</Text>
            <Pressable style={styles.suggest} onPress={() => router.replace("/(tabs)/create")}>
              <Text style={styles.suggestText}>＋ {t("suggestNew")}</Text>
            </Pressable>
          </View>
        )}

        {results.map((th) => {
          const tr = getThreadTranslation(th.id, locale);
          return (
            <Pressable key={th.id} style={styles.row} onPress={() => pick(th.id)}>
              <View style={styles.typePill}>
                <Text style={styles.typeText}>{threadTypeLabel(th.type, locale)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={1}>{tr.title}</Text>
                <Text style={styles.summary} numberOfLines={1}>{tr.summary}</Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgMain },
    bar: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingHorizontal: space.lg, paddingBottom: space.sm },
    cancel: { color: c.textMain, fontSize: 22, width: 28 },
    input: {
      flex: 1, borderWidth: 1, borderColor: c.lineDefault, borderRadius: radius.md,
      paddingHorizontal: space.md, paddingVertical: 10, fontSize: font.body, color: c.textMain, backgroundColor: c.surface,
    },
    muted: { color: c.textMuted, fontSize: font.small },
    suggest: { borderWidth: 1, borderColor: c.accentActive, borderRadius: radius.pill, paddingHorizontal: space.lg, paddingVertical: 10 },
    suggestText: { color: c.accentActive, fontWeight: "700", fontSize: font.small },
    row: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.line2 },
    typePill: { backgroundColor: c.line2, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
    typeText: { fontSize: font.tiny, color: c.textMuted },
    title: { fontSize: font.body, fontWeight: "600", color: c.textMain },
    summary: { fontSize: font.small, color: c.textMuted, marginTop: 1 },
    chev: { color: c.textMuted, fontSize: 18 },
  });

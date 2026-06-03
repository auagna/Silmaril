import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { H1, Muted } from "@/components/ui";
import { MVP_THREAD_TYPES, threadTypeLabel, type ThreadType } from "@/types/database";
import { useTheme, space, radius, font, type Palette } from "@/theme";
import { useLocale } from "@/i18n";

// PHASE 19/48(목): 새 실마리 / 관점 / 연결 제안. 실제 저장은 EXP4(review_candidates). 지금은 mock submit.
type Mode = "keyword" | "viewpoint" | "relation";

export default function CreateScreen() {
  const c = useTheme().colors;
  const { t, locale } = useLocale();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [mode, setMode] = useState<Mode>("keyword");

  // keyword
  const [kTitle, setKTitle] = useState("");
  const [kType, setKType] = useState<ThreadType>("person");
  const [kSummary, setKSummary] = useState("");
  // viewpoint
  const [vThread, setVThread] = useState("");
  const [vTitle, setVTitle] = useState("");
  const [vBody, setVBody] = useState("");
  // relation
  const [rFrom, setRFrom] = useState("");
  const [rTo, setRTo] = useState("");
  const [rType, setRType] = useState("");

  function submit() {
    Alert.alert("Silmaril", t("submitted"));
    setKTitle(""); setKSummary(""); setVThread(""); setVTitle(""); setVBody(""); setRFrom(""); setRTo(""); setRType("");
  }

  const tabs: { key: Mode; label: string }[] = [
    { key: "keyword", label: locale === "en" ? "Keyword" : "실마리" },
    { key: "relation", label: locale === "en" ? "Relation" : "연결" },
    { key: "viewpoint", label: locale === "en" ? "Viewpoint" : "관점" },
  ];

  return (
    <Screen>
      <H1>{t("create")}</H1>
      <Muted style={{ marginTop: 4 }}>{t("createSubtitle")}</Muted>

      <View style={styles.tabs}>
        {tabs.map((tb) => (
          <Pressable key={tb.key} style={[styles.tab, mode === tb.key && styles.tabOn]} onPress={() => setMode(tb.key)}>
            <Text style={[styles.tabText, mode === tb.key && styles.tabTextOn]}>{tb.label}</Text>
          </Pressable>
        ))}
      </View>

      {mode === "keyword" && (
        <View style={styles.form}>
          <TextInput style={styles.input} value={kTitle} onChangeText={setKTitle} placeholder={t("fldTitle")} placeholderTextColor={c.textMuted} />
          <View style={styles.typeRow}>
            {MVP_THREAD_TYPES.map((tt) => (
              <Pressable key={tt} style={[styles.tchip, kType === tt && styles.tchipOn]} onPress={() => setKType(tt)}>
                <Text style={[styles.tchipText, kType === tt && styles.tchipTextOn]}>{threadTypeLabel(tt, locale)}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput style={[styles.input, styles.area]} value={kSummary} onChangeText={setKSummary} placeholder={t("fldSummary")} placeholderTextColor={c.textMuted} multiline />
        </View>
      )}

      {mode === "relation" && (
        <View style={styles.form}>
          <TextInput style={styles.input} value={rFrom} onChangeText={setRFrom} placeholder={locale === "en" ? "From thread" : "출발 실마리"} placeholderTextColor={c.textMuted} />
          <TextInput style={styles.input} value={rTo} onChangeText={setRTo} placeholder={locale === "en" ? "To thread" : "도착 실마리"} placeholderTextColor={c.textMuted} />
          <TextInput style={styles.input} value={rType} onChangeText={setRType} placeholder={locale === "en" ? "Relation (e.g. influenced_by)" : "관계 (예: influenced_by)"} placeholderTextColor={c.textMuted} autoCapitalize="none" />
        </View>
      )}

      {mode === "viewpoint" && (
        <View style={styles.form}>
          <TextInput style={styles.input} value={vThread} onChangeText={setVThread} placeholder={locale === "en" ? "Thread" : "실마리"} placeholderTextColor={c.textMuted} />
          <TextInput style={styles.input} value={vTitle} onChangeText={setVTitle} placeholder={t("fldTitle")} placeholderTextColor={c.textMuted} />
          <TextInput style={[styles.input, styles.area]} value={vBody} onChangeText={setVBody} placeholder={t("fldBody")} placeholderTextColor={c.textMuted} multiline />
        </View>
      )}

      <Pressable style={styles.submit} onPress={submit}>
        <Text style={styles.submitText}>{t("submit")}</Text>
      </Pressable>
      <Muted style={{ marginTop: space.md, fontSize: font.tiny }}>
        ※ 실제 저장/검토 큐 연결은 EXP4. 지금은 입력 확인용 목업.
      </Muted>
    </Screen>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    tabs: { flexDirection: "row", gap: space.sm, marginTop: space.md },
    tab: { borderWidth: 1, borderColor: c.lineDefault, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: c.surface },
    tabOn: { backgroundColor: c.nodeDefault, borderColor: c.nodeDefault },
    tabText: { color: c.textMuted, fontSize: font.small, fontWeight: "600" },
    tabTextOn: { color: c.nodeText },
    form: { marginTop: space.md, gap: space.sm },
    input: { borderWidth: 1, borderColor: c.lineDefault, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: 11, fontSize: font.body, color: c.textMain, backgroundColor: c.surface },
    area: { minHeight: 90, textAlignVertical: "top" },
    typeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    tchip: { borderWidth: 1, borderColor: c.lineDefault, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: c.surface },
    tchipOn: { backgroundColor: c.accentActive, borderColor: c.accentActive },
    tchipText: { color: c.textMuted, fontSize: font.small },
    tchipTextOn: { color: c.onAccent, fontWeight: "700" },
    submit: { marginTop: space.lg, backgroundColor: c.nodeDefault, borderRadius: radius.pill, paddingVertical: 14, alignItems: "center" },
    submitText: { color: c.nodeText, fontWeight: "700", fontSize: font.body },
  });

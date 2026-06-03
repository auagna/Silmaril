import { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { H1, H2, Muted, SectionLabel, Card, Thumb, Chip } from "@/components/ui";
import { useSaves } from "@/features/saves/store";
import { useTheme, space, font, type Palette } from "@/theme";
import { useLocale } from "@/i18n";

// My View = 나. 내 지도 / 취향 키워드 / 탐험 통계 / 리포트(자리) + 언어 토글.
export default function MyViewScreen() {
  const router = useRouter();
  const c = useTheme().colors;
  const { t, locale, setLocale } = useLocale();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { count } = useSaves();

  const stats = [
    { n: String(count), l: "저장" },
    { n: "2", l: "컬렉션" },
    { n: "9", l: "발견" },
    { n: "18%", l: "세계" },
  ];
  const keywords = ["빛", "침묵", "물성", "기능주의"];

  return (
    <Screen>
      <H1>{t("myView")}</H1>

      <View style={styles.head}>
        <Thumb size={60} label="me" />
        <View style={{ flex: 1 }}>
          <H2>@yujin</H2>
          <Text style={styles.combo}>건축가 × 발굴자</Text>
          <Muted>탐험 정체성 (추후 — 행동 기반)</Muted>
        </View>
      </View>

      <SectionLabel>{t("myMap")}</SectionLabel>
      <Card>
        <View style={styles.stats}>
          {stats.map((s) => (
            <View key={s.l} style={styles.stat}>
              <Text style={styles.statN}>{s.n}</Text>
              <Text style={styles.statL}>{s.l}</Text>
            </View>
          ))}
        </View>
      </Card>

      <SectionLabel>{t("litWorld")}</SectionLabel>
      <Card>
        <View style={styles.progRow}><Text style={styles.pl}>Japan</Text><Muted>32%</Muted></View>
        <View style={styles.track}><View style={[styles.fill, { width: "32%" }]} /></View>
        <View style={[styles.progRow, { marginTop: space.sm }]}><Text style={styles.pl}>Modernism</Text><Muted>18%</Muted></View>
        <View style={styles.track}><View style={[styles.fill, { width: "18%" }]} /></View>
      </Card>

      <SectionLabel>{t("tasteKeywords")}</SectionLabel>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {keywords.map((k) => <Chip key={k} label={k} />)}
      </View>

      <SectionLabel>{t("language")}</SectionLabel>
      <View style={{ flexDirection: "row", gap: space.sm }}>
        <Pressable onPress={() => setLocale("ko")} style={[styles.lang, locale === "ko" && styles.langOn]}>
          <Text style={[styles.langText, locale === "ko" && styles.langTextOn]}>한국어</Text>
        </Pressable>
        <Pressable onPress={() => setLocale("en")} style={[styles.lang, locale === "en" && styles.langOn]}>
          <Text style={[styles.langText, locale === "en" && styles.langTextOn]}>English</Text>
        </Pressable>
      </View>

      <SectionLabel>리포트 · 계정</SectionLabel>
      <Card onPress={() => router.push("/auth/login")}>
        <Text style={styles.acc}>로그인 / 회원가입</Text>
        <Muted style={{ marginTop: 2 }}>취향 리포트와 실제 인증은 다음 단계(EXP4)</Muted>
      </Card>
    </Screen>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    head: { flexDirection: "row", gap: space.md, alignItems: "center", marginTop: space.md },
    combo: { fontSize: font.body, fontWeight: "700", color: c.textMain, marginTop: 3 },
    stats: { flexDirection: "row" },
    stat: { flex: 1, alignItems: "center" },
    statN: { fontSize: font.h2, fontWeight: "700", color: c.textMain },
    statL: { fontSize: font.tiny, color: c.textMuted, marginTop: 2 },
    progRow: { flexDirection: "row", justifyContent: "space-between" },
    pl: { fontSize: font.small, color: c.textMain },
    track: { height: 6, backgroundColor: c.line2, borderRadius: 6, overflow: "hidden", marginTop: 4 },
    fill: { height: "100%", backgroundColor: c.nodeDefault, borderRadius: 6 },
    acc: { color: c.textMain, fontSize: font.body },
    lang: { flex: 1, borderWidth: 1, borderColor: c.lineDefault, borderRadius: 999, paddingVertical: 10, alignItems: "center", backgroundColor: c.surface },
    langOn: { backgroundColor: c.accentActive, borderColor: c.accentActive },
    langText: { fontSize: font.small, color: c.textMain, fontWeight: "600" },
    langTextOn: { color: c.onAccent },
  });

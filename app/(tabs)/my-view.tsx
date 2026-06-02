import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { H1, H2, Muted, SectionLabel, Card, Thumb, Chip } from "@/components/ui";
import { useSaves } from "@/features/saves/store";
import { colors, space, font } from "@/constants/theme";

// My View = 나. 내 지도 / 취향 키워드 / 탐험 통계 / 리포트(자리).
export default function MyViewScreen() {
  const router = useRouter();
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
      <H1>나</H1>

      <View style={styles.head}>
        <Thumb size={60} label="me" />
        <View style={{ flex: 1 }}>
          <H2>@yujin</H2>
          <Text style={styles.combo}>건축가 × 발굴자</Text>
          <Muted>탐험 정체성 (추후 — 행동 기반)</Muted>
        </View>
      </View>

      <SectionLabel>내 지도</SectionLabel>
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

      <SectionLabel>밝힌 세계</SectionLabel>
      <Card>
        <View style={styles.progRow}><Text style={styles.pl}>일본 건축</Text><Muted>32%</Muted></View>
        <View style={styles.track}><View style={[styles.fill, { width: "32%" }]} /></View>
        <View style={[styles.progRow, { marginTop: space.sm }]}><Text style={styles.pl}>기능주의</Text><Muted>18%</Muted></View>
        <View style={styles.track}><View style={[styles.fill, { width: "18%" }]} /></View>
      </Card>

      <SectionLabel>취향 키워드</SectionLabel>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {keywords.map((k) => <Chip key={k} label={k} />)}
      </View>

      <SectionLabel>리포트 · 계정</SectionLabel>
      <Card onPress={() => router.push("/auth/login")}>
        <Text style={{ color: colors.ink700, fontSize: font.body }}>로그인 / 회원가입</Text>
        <Muted style={{ marginTop: 2 }}>취향 리포트와 실제 인증은 다음 단계(EXP4)</Muted>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", gap: space.md, alignItems: "center", marginTop: space.md },
  combo: { fontSize: font.body, fontWeight: "700", color: colors.ink900, marginTop: 3 },
  stats: { flexDirection: "row" },
  stat: { flex: 1, alignItems: "center" },
  statN: { fontSize: font.h2, fontWeight: "700", color: colors.ink900 },
  statL: { fontSize: font.tiny, color: colors.ink400, marginTop: 2 },
  progRow: { flexDirection: "row", justifyContent: "space-between" },
  pl: { fontSize: font.small, color: colors.ink700 },
  track: { height: 6, backgroundColor: colors.line2, borderRadius: 6, overflow: "hidden", marginTop: 4 },
  fill: { height: "100%", backgroundColor: colors.accent, borderRadius: 6 },
});

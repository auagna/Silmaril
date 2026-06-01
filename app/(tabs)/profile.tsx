import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { H1, H2, Muted, SectionLabel, Card, Thumb, Chip } from "@/components/ui";
import { useSaves } from "@/features/saves/store";
import { colors, space, font } from "@/constants/theme";

export default function ProfileScreen() {
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
      <H1>프로필</H1>

      <View style={styles.head}>
        <Thumb size={60} label="me" />
        <View style={{ flex: 1 }}>
          <H2>@yujin</H2>
          <Text style={styles.combo}>건축가 × 발굴자</Text>
          <Muted>탐험 정체성 (추후 — 행동 기반)</Muted>
        </View>
      </View>

      <SectionLabel>탐험 통계</SectionLabel>
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

      <SectionLabel>탐험 키워드</SectionLabel>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {keywords.map((k) => (
          <Chip key={k} label={k} />
        ))}
      </View>

      <SectionLabel>계정</SectionLabel>
      <Card onPress={() => router.push("/auth/login")}>
        <Text style={{ color: colors.ink700, fontSize: font.body }}>로그인 / 회원가입</Text>
        <Muted style={{ marginTop: 2 }}>실제 인증 연결은 다음 단계(EXP4)</Muted>
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
});

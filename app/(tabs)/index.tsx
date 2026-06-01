import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { H1, H2, Muted, SectionLabel, Card, SaveButton, Thumb } from "@/components/ui";
import { ThreadCard } from "@/components/cards/ThreadCard";
import { useSaves } from "@/features/saves/store";
import { threads, getThreadById, undiscovered } from "@/lib/dummy";
import { colors, space, font, radius } from "@/constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { isSaved, toggle } = useSaves();

  const hero = getThreadById("ando-tadao")!;
  const cont = ["louis-kahn", "carlo-scarpa", "phenomenology"].map((id) => getThreadById(id)!);
  const recent = ["dieter-rams", "bauhaus"].map((id) => getThreadById(id)!);
  const undisc = undiscovered();

  return (
    <Screen>
      <Muted>Silmaril</Muted>
      <H1 style={{ marginTop: 2 }}>발견</H1>

      <SectionLabel>오늘의 발견</SectionLabel>
      <Card onPress={() => router.push(`/thread/${hero.slug}`)} style={{ borderColor: colors.ink400 }}>
        <H2>{hero.title}</H2>
        <Muted style={{ marginTop: 6 }}>{hero.summary}</Muted>
        <View style={styles.heroFoot}>
          <View style={styles.typePill}><Text style={styles.typeText}>인물</Text></View>
          <Muted>연결 6 · 저장 88</Muted>
          <View style={{ marginLeft: "auto" }}>
            <SaveButton saved={isSaved(hero.id)} onPress={() => toggle(hero.id)} />
          </View>
        </View>
      </Card>

      <SectionLabel>이어서 탐험</SectionLabel>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
        {cont.map((th) => (
          <Pressable key={th.id} onPress={() => router.push(`/thread/${th.slug}`)} style={styles.miniCard}>
            <Thumb size={40} />
            <Text style={styles.miniTitle} numberOfLines={1}>{th.title}</Text>
            <Muted>{th.type === "movement" ? "사조" : "인물"}</Muted>
          </Pressable>
        ))}
      </ScrollView>

      <SectionLabel>최근 저장 기반</SectionLabel>
      {recent.map((th) => (
        <ThreadCard key={th.id} thread={th} saved={isSaved(th.id)} onToggleSave={toggle} />
      ))}

      <SectionLabel>새로운 흔적</SectionLabel>
      <Card>
        <Muted style={{ lineHeight: 20 }}>
          최근 저장한 실마리들이 <Text style={{ color: colors.ink900, fontWeight: "700" }}>‘빛’</Text>과 연결되고 있어요.
        </Muted>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: space.sm }}>
          {undisc.map((th) => (
            <Pressable key={th.id} onPress={() => router.push(`/thread/${th.slug}`)} style={styles.trace}>
              <Text style={styles.traceText}>{th.title}</Text>
            </Pressable>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroFoot: { flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: space.md },
  typePill: { backgroundColor: colors.line2, borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 1 },
  typeText: { fontSize: font.tiny, color: colors.ink500 },
  miniCard: {
    width: 124, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.md, padding: space.sm, gap: 6,
  },
  miniTitle: { fontSize: font.small, fontWeight: "600", color: colors.ink900 },
  trace: {
    borderWidth: 1, borderColor: colors.line, borderStyle: "dashed", borderRadius: radius.pill,
    paddingHorizontal: 11, paddingVertical: 5, backgroundColor: colors.bg,
  },
  traceText: { fontSize: font.small, color: colors.ink700 },
});

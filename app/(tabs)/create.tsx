import { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { H1, Muted } from "@/components/ui";
import { useTheme, space, radius, font, type Palette } from "@/theme";

const items = [
  { key: "thread", title: "실마리 생성", body: "인물·작품·사조·장소·개념·조직. 초안은 즉시 내 지도에." },
  { key: "record", title: "기록 생성", body: "짧게 남겨요. 실마리에 묶거나 자유롭게. (선택)" },
  { key: "collection", title: "컬렉션 생성", body: "실마리를 묶어 나만의 큐레이션." },
];

export default function CreateScreen() {
  const c = useTheme().colors;
  const styles = useMemo(() => makeStyles(c), [c]);
  return (
    <Screen>
      <H1>만들기</H1>
      <Muted style={{ marginTop: 4 }}>완벽하지 않아도 됩니다. 먼저 남기고, 나중에 잇기.</Muted>

      <View style={{ marginTop: space.md, gap: space.sm }}>
        {items.map((it) => (
          <Pressable key={it.key} style={styles.card}>
            <Text style={styles.title}>{it.title}</Text>
            <Text style={styles.body}>{it.body}</Text>
            <Text style={styles.cta}>시작하기 →</Text>
          </Pressable>
        ))}
      </View>

      <Muted style={{ marginTop: space.lg, fontSize: font.tiny }}>
        ※ 생성 폼은 Supabase 연결(EXP4) 단계에서 동작합니다. 지금은 진입점만.
      </Muted>
    </Screen>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    card: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.lineDefault, borderRadius: radius.md, padding: space.lg },
    title: { fontSize: font.h3, fontWeight: "700", color: c.textMain },
    body: { fontSize: font.small, color: c.textMuted, marginTop: 4, lineHeight: 20 },
    cta: { fontSize: font.tiny, color: c.textMuted, marginTop: space.md },
  });

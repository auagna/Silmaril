import { useMemo, useState } from "react";
import { View, TextInput, ScrollView, StyleSheet } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { H1, Chip, SectionLabel, Muted } from "@/components/ui";
import { ThreadCard } from "@/components/cards/ThreadCard";
import { useSaves } from "@/features/saves/store";
import { searchThreads } from "@/lib/dummy";
import { MVP_THREAD_TYPES, THREAD_TYPE_LABEL, type ThreadType } from "@/types/database";
import { colors, space, radius, font } from "@/constants/theme";

export default function SearchScreen() {
  const { isSaved, toggle } = useSaves();
  const [q, setQ] = useState("");
  const [type, setType] = useState<ThreadType | null>(null);

  const results = useMemo(() => searchThreads(q, type ?? undefined), [q, type]);

  return (
    <Screen>
      <H1>검색</H1>
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="디터 람스, 바우하우스, 빛…"
        placeholderTextColor={colors.ink400}
        style={styles.input}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: space.sm }}>
        <Chip label="전체" active={type === null} onPress={() => setType(null)} />
        {MVP_THREAD_TYPES.map((tt) => (
          <Chip key={tt} label={THREAD_TYPE_LABEL[tt]} active={type === tt} onPress={() => setType(tt)} />
        ))}
      </ScrollView>

      <SectionLabel>결과 · {results.length}</SectionLabel>
      {results.length === 0 ? (
        <Muted>검색 결과가 없어요. 다른 키워드를 시도해 보세요.</Muted>
      ) : (
        <View style={{ marginTop: 4 }}>
          {results.map((th) => (
            <ThreadCard key={th.id} thread={th} saved={isSaved(th.id)} onToggleSave={toggle} />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: space.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: 11,
    fontSize: font.body,
    color: colors.ink900,
    backgroundColor: colors.surface,
  },
});

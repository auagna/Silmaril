import { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import type { Thread } from "@/types/database";
import { THREAD_TYPE_LABEL } from "@/types/database";
import { useTheme, space, radius, font, type Palette } from "@/theme";
import { useLocale } from "@/i18n";
import { getThreadTranslation } from "@/lib/dummy";
import { SaveButton, Thumb } from "@/components/ui";

export function ThreadCard({
  thread,
  saved,
  onToggleSave,
  meta,
}: {
  thread: Thread;
  saved: boolean;
  onToggleSave: (id: string) => void;
  meta?: string;
}) {
  const router = useRouter();
  const c = useTheme().colors;
  const { locale } = useLocale();
  const styles = useMemo(() => makeStyles(c), [c]);
  const tr = getThreadTranslation(thread.id, locale);
  return (
    <Pressable
      onPress={() => router.push(`/thread/${thread.slug}`)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.row}>
        <Thumb />
        <View style={styles.mid}>
          <Text style={styles.title} numberOfLines={1}>{tr.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.typePill}>
              <Text style={styles.typeText}>{THREAD_TYPE_LABEL[thread.type]}</Text>
            </View>
            <Text style={styles.meta} numberOfLines={1}>{meta ?? tr.summary}</Text>
          </View>
        </View>
        <SaveButton saved={saved} onPress={() => onToggleSave(thread.id)} />
      </View>
    </Pressable>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surface, borderWidth: 1, borderColor: c.lineDefault,
      borderRadius: radius.md, padding: space.md, marginBottom: space.sm,
    },
    row: { flexDirection: "row", alignItems: "center", gap: space.md },
    mid: { flex: 1, gap: 4 },
    title: { fontSize: font.body, fontWeight: "600", color: c.textMain },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    typePill: { backgroundColor: c.line2, borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 1 },
    typeText: { fontSize: font.tiny, color: c.textMuted },
    meta: { fontSize: font.tiny, color: c.textMuted, flex: 1 },
  });

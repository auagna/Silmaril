import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import type { Thread } from "@/types/database";
import { THREAD_TYPE_LABEL } from "@/types/database";
import { colors, space, radius, font } from "@/constants/theme";
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
  return (
    <Pressable
      onPress={() => router.push(`/thread/${thread.slug}`)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.row}>
        <Thumb />
        <View style={styles.mid}>
          <Text style={styles.title} numberOfLines={1}>
            {thread.title}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.typePill}>
              <Text style={styles.typeText}>{THREAD_TYPE_LABEL[thread.type]}</Text>
            </View>
            {thread.origin === "ai" && (
              <View style={styles.aiPill}>
                <Text style={styles.aiText}>AI</Text>
              </View>
            )}
            <Text style={styles.meta} numberOfLines={1}>
              {meta ?? thread.summary ?? ""}
            </Text>
          </View>
        </View>
        <SaveButton saved={saved} onPress={() => onToggleSave(thread.id)} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: space.md,
    marginBottom: space.sm,
  },
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  mid: { flex: 1, gap: 4 },
  title: { fontSize: font.body, fontWeight: "600", color: colors.ink900 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  typePill: {
    backgroundColor: colors.line2,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  typeText: { fontSize: font.tiny, color: colors.ink500 },
  aiPill: { backgroundColor: "#e6f4f0", borderRadius: radius.pill, paddingHorizontal: 6, paddingVertical: 1 },
  aiText: { fontSize: font.tiny, color: colors.accent, fontWeight: "700" },
  meta: { fontSize: font.tiny, color: colors.ink400, flex: 1 },
});

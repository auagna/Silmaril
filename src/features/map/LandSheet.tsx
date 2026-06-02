import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getThreadById, connectionsOf } from "@/lib/dummy";
import { THREAD_TYPE_LABEL, RELATION_LABEL } from "@/types/database";
import { useSaves } from "@/features/saves/store";
import { colors, space, radius, font } from "@/constants/theme";

// Land = 선택한 실마리 상세(바텀 시트). 페이지 이동이 아니라 오버레이 → 탐험 끊김 최소화.
export function LandSheet({
  threadId,
  onClose,
  onSelectThread,
}: {
  threadId: string | null;
  onClose: () => void;
  onSelectThread: (id: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const { isSaved, toggle } = useSaves();

  if (!threadId) return null;
  const thread = getThreadById(threadId);
  if (!thread) return null;

  const conns = connectionsOf(thread.id);
  const saved = isSaved(thread.id);

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + space.md }]}>
        <View style={styles.handle} />

        <View style={styles.row}>
          <View style={styles.typePill}>
            <Text style={styles.typeText}>{THREAD_TYPE_LABEL[thread.type]}</Text>
          </View>
          <Pressable onPress={onClose} hitSlop={8}>
            <Text style={styles.close}>닫기</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>{thread.title}</Text>
        <Text style={styles.summary}>{thread.summary}</Text>

        {/* 저장 — 1급, 1탭 */}
        <Pressable onPress={() => toggle(thread.id)} style={[styles.save, saved && styles.saveOn]}>
          <Text style={[styles.saveText, saved && styles.saveTextOn]}>{saved ? "✓ 저장됨" : "＋ 저장"}</Text>
        </Pressable>

        <View style={styles.actionRow}>
          <View style={styles.miniBtn}><Text style={styles.miniText}>컬렉션 추가</Text></View>
          <View style={styles.miniBtn}><Text style={styles.miniText}>관점</Text></View>
        </View>

        <Text style={styles.sectionLbl}>연결 · {conns.length}</Text>
        <ScrollView style={{ maxHeight: 180 }} showsVerticalScrollIndicator={false}>
          {conns.map((c) => (
            <Pressable key={c.thread.id} onPress={() => onSelectThread(c.thread.id)} style={styles.conn}>
              <View style={[styles.rel, c.tier === 2 && styles.relTier2]}>
                <Text style={styles.relText}>{RELATION_LABEL[c.relation_type]}</Text>
              </View>
              <Text style={styles.connName} numberOfLines={1}>{c.thread.title}</Text>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.hint}>출처 · 관점은 다음 단계에서 연결됩니다.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end", zIndex: 10 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
  },
  handle: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, backgroundColor: colors.line, marginBottom: space.sm },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  typePill: { backgroundColor: colors.line2, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  typeText: { fontSize: font.tiny, color: colors.ink500 },
  close: { fontSize: font.small, color: colors.ink400 },
  title: { fontSize: font.h2, fontWeight: "700", color: colors.ink900, marginTop: space.sm },
  summary: { fontSize: font.small, color: colors.ink500, marginTop: 4, lineHeight: 20 },
  save: {
    marginTop: space.md, backgroundColor: colors.ink900, borderRadius: radius.pill,
    paddingVertical: 12, alignItems: "center",
  },
  saveOn: { backgroundColor: colors.accent },
  saveText: { color: "#fff", fontWeight: "700", fontSize: font.body },
  saveTextOn: { color: "#fff" },
  actionRow: { flexDirection: "row", gap: space.sm, marginTop: space.sm },
  miniBtn: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingVertical: 9, alignItems: "center" },
  miniText: { fontSize: font.small, color: colors.ink700 },
  sectionLbl: {
    fontSize: font.tiny, fontWeight: "700", color: colors.ink400, letterSpacing: 0.6,
    textTransform: "uppercase", marginTop: space.lg, marginBottom: space.xs,
  },
  conn: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: colors.line2 },
  rel: { backgroundColor: "#8a8f98", borderRadius: 5, paddingHorizontal: 6, paddingVertical: 1 },
  relTier2: { backgroundColor: colors.accent },
  relText: { fontSize: 10, color: "#fff" },
  connName: { flex: 1, fontSize: font.body, fontWeight: "600", color: colors.ink900 },
  chev: { color: colors.ink400, fontSize: 18 },
  hint: { fontSize: font.tiny, color: colors.ink400, marginTop: space.md },
});

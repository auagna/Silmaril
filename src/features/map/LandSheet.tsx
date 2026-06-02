import { useMemo } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from "react-native";

// 작은 화면(SE급)에서도 시트가 화면을 다 덮지 않도록 높이 상한.
const SHEET_MAX_H = Dimensions.get("window").height * 0.72;
import { getThreadById, connectionsOf } from "@/lib/dummy";
import { THREAD_TYPE_LABEL, RELATION_LABEL } from "@/types/database";
import { useSaves } from "@/features/saves/store";
import { useTheme, space, radius, font, type Palette } from "@/theme";

// Land = 선택한 실마리 상세(바텀 시트). 배경 = bgSheet 토큰.
export function LandSheet({
  threadId,
  onClose,
  onSelectThread,
}: {
  threadId: string | null;
  onClose: () => void;
  onSelectThread: (id: string) => void;
}) {
  const c = useTheme().colors;
  const styles = useMemo(() => makeStyles(c), [c]);
  const { isSaved, toggle } = useSaves();

  if (!threadId) return null;
  const thread = getThreadById(threadId);
  if (!thread) return null;

  const conns = connectionsOf(thread.id);
  const saved = isSaved(thread.id);

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
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

        <Pressable onPress={() => toggle(thread.id)} style={[styles.save, saved && styles.saveOn]}>
          <Text style={[styles.saveText, saved && styles.saveTextOn]}>{saved ? "✓ 저장됨" : "＋ 저장"}</Text>
        </Pressable>

        <View style={styles.actionRow}>
          <View style={styles.miniBtn}><Text style={styles.miniText}>컬렉션 추가</Text></View>
          <View style={styles.miniBtn}><Text style={styles.miniText}>관점</Text></View>
        </View>

        <Text style={styles.sectionLbl}>연결 · {conns.length}</Text>
        <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={false}>
          {conns.map((cn) => (
            <Pressable key={cn.thread.id} onPress={() => onSelectThread(cn.thread.id)} style={styles.conn}>
              <View style={[styles.rel, cn.tier === 2 && styles.relTier2]}>
                <Text style={styles.relText}>{RELATION_LABEL[cn.relation_type]}</Text>
              </View>
              <Text style={styles.connName} numberOfLines={1}>{cn.thread.title}</Text>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.hint}>출처 · 관점은 다음 단계에서 연결됩니다.</Text>
      </View>
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end", zIndex: 10 },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
    sheet: { backgroundColor: c.bgSheet, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.lg, maxHeight: SHEET_MAX_H },
    handle: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, backgroundColor: c.lineDefault, marginBottom: space.sm },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    typePill: { backgroundColor: c.line2, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
    typeText: { fontSize: font.tiny, color: c.textMuted },
    close: { fontSize: font.small, color: c.textMuted },
    title: { fontSize: font.h2, fontWeight: "700", color: c.textMain, marginTop: space.sm },
    summary: { fontSize: font.small, color: c.textMuted, marginTop: 4, lineHeight: 20 },
    save: { marginTop: space.md, backgroundColor: c.accentActive, borderRadius: radius.pill, paddingVertical: 12, alignItems: "center" },
    saveOn: { backgroundColor: c.accentActive },
    saveText: { color: c.onAccent, fontWeight: "700", fontSize: font.body },
    saveTextOn: { color: c.onAccent },
    actionRow: { flexDirection: "row", gap: space.sm, marginTop: space.sm },
    miniBtn: { flex: 1, borderWidth: 1, borderColor: c.lineDefault, borderRadius: radius.pill, paddingVertical: 9, alignItems: "center" },
    miniText: { fontSize: font.small, color: c.textMain },
    sectionLbl: { fontSize: font.tiny, fontWeight: "700", color: c.textMuted, letterSpacing: 0.6, textTransform: "uppercase", marginTop: space.lg, marginBottom: space.xs },
    conn: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: c.line2 },
    rel: { backgroundColor: c.textMuted, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 1 },
    relTier2: { backgroundColor: c.accentRecommend },
    relText: { fontSize: 10, color: c.onAccent },
    connName: { flex: 1, fontSize: font.body, fontWeight: "600", color: c.textMain },
    chev: { color: c.textMuted, fontSize: 18 },
    hint: { fontSize: font.tiny, color: c.textMuted, marginTop: space.md },
  });

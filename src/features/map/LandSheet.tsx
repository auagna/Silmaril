import { useMemo } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from "react-native";
import { getThreadById, connectionsOf, getThreadTranslation, getViewpoints } from "@/lib/dummy";
import { threadTypeLabel, RELATION_LABEL } from "@/types/database";
import { useSaves } from "@/features/saves/store";
import { useTheme, space, radius, font, type Palette } from "@/theme";
import { useLocale } from "@/i18n";

// 작은 화면(SE급)에서도 시트가 화면을 다 덮지 않도록 높이 상한.
const SHEET_MAX_H = Dimensions.get("window").height * 0.72;

// Land = 선택한 실마리 상세(바텀 시트). 배경 = bgSheet. ko/en 번역 적용.
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
  const { t, locale } = useLocale();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { isSaved, toggle } = useSaves();

  if (!threadId) return null;
  const thread = getThreadById(threadId);
  if (!thread) return null;

  const tr = getThreadTranslation(thread.id, locale);
  const conns = connectionsOf(thread.id);
  const views = getViewpoints(thread.id, locale);
  const saved = isSaved(thread.id);

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.row}>
          <View style={styles.typePill}>
            <Text style={styles.typeText}>{threadTypeLabel(thread.type, locale)}</Text>
          </View>
          <Pressable onPress={onClose} hitSlop={10}>
            <Text style={styles.close}>{t("close")}</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>{tr.title}</Text>
        <Text style={styles.summary}>{tr.summary}</Text>

        <Pressable onPress={() => toggle(thread.id)} style={styles.save} hitSlop={6}>
          <Text style={styles.saveText}>{saved ? `✓ ${t("saved")}` : `＋ ${t("save")}`}</Text>
        </Pressable>

        <View style={styles.actionRow}>
          <View style={styles.miniBtn}><Text style={styles.miniText}>{t("addCollection")}</Text></View>
        </View>

        <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={false}>
          {/* 연결 */}
          <Text style={styles.sectionLbl}>{t("connections")} · {conns.length}</Text>
          {conns.map((cn) => (
            <Pressable key={cn.thread.id} onPress={() => onSelectThread(cn.thread.id)} style={styles.conn}>
              <View style={[styles.rel, cn.tier === 2 && styles.relTier2]}>
                <Text style={styles.relText}>{RELATION_LABEL[cn.relation_type]}</Text>
              </View>
              <Text style={styles.connName} numberOfLines={1}>{getThreadTranslation(cn.thread.id, locale).title}</Text>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          ))}

          {/* 관점 */}
          {views.length > 0 && (
            <>
              <Text style={styles.sectionLbl}>{t("views")} · {views.length}</Text>
              {views.map((v) => (
                <View key={v.id} style={styles.vp}>
                  <View style={styles.vpHead}>
                    <Text style={styles.vpTag}>{v.author_type === "curator" ? t("curatorViews") : t("userViews")}</Text>
                    {v.locale !== locale && <Text style={styles.vpLang}>{v.locale.toUpperCase()}</Text>}
                  </View>
                  <Text style={styles.vpTitle}>{v.title}</Text>
                  <Text style={styles.vpBody}>{v.body}</Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>
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
    saveText: { color: c.onAccent, fontWeight: "700", fontSize: font.body },
    actionRow: { flexDirection: "row", gap: space.sm, marginTop: space.sm, marginBottom: space.xs },
    miniBtn: { flex: 1, borderWidth: 1, borderColor: c.lineDefault, borderRadius: radius.pill, paddingVertical: 9, alignItems: "center" },
    miniText: { fontSize: font.small, color: c.textMain },
    sectionLbl: { fontSize: font.tiny, fontWeight: "700", color: c.textMuted, letterSpacing: 0.6, textTransform: "uppercase", marginTop: space.md, marginBottom: space.xs },
    conn: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: c.line2 },
    rel: { backgroundColor: c.textMuted, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 1 },
    relTier2: { backgroundColor: c.accentRecommend },
    relText: { fontSize: 10, color: c.onAccent },
    connName: { flex: 1, fontSize: font.body, fontWeight: "600", color: c.textMain },
    chev: { color: c.textMuted, fontSize: 18 },
    vp: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: c.line2 },
    vpHead: { flexDirection: "row", alignItems: "center", gap: 6 },
    vpTag: { fontSize: 10, color: c.textMuted },
    vpLang: { fontSize: 9, color: c.onAccent, backgroundColor: c.textMuted, borderRadius: 4, paddingHorizontal: 4 },
    vpTitle: { fontSize: font.small, fontWeight: "700", color: c.textMain, marginTop: 2 },
    vpBody: { fontSize: font.small, color: c.textMuted, marginTop: 2, lineHeight: 19 },
  });

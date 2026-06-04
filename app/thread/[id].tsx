import { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { H1, Muted, SectionLabel, Card, SaveButton, Thumb } from "@/components/ui";
import { useSaves } from "@/features/saves/store";
import { getThreadById, connectionsOf } from "@/lib/dummy";
import { THREAD_TYPE_LABEL, RELATION_LABEL } from "@/types/database";
import { space, radius, font } from "@/constants/theme";
import { useTheme, type Palette } from "@/theme";

export default function ThreadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isSaved, toggle } = useSaves();
  const c = useTheme().colors;
  const styles = useMemo(() => makeStyles(c), [c]);
  const [open, setOpen] = useState(false);

  const thread = id ? getThreadById(id) : undefined;

  if (!thread) {
    return (
      <Screen>
        <Pressable onPress={() => router.back()}><Muted>← 뒤로</Muted></Pressable>
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <Muted>실마리를 찾을 수 없어요.</Muted>
        </View>
      </Screen>
    );
  }

  const conns = connectionsOf(thread.id);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={8}><Muted>← 뒤로</Muted></Pressable>
      <Thumb size={120} label="cover" />
      <H1 style={{ marginTop: space.md }}>{thread.title}</H1>
      <View style={styles.pills}>
        <View style={styles.typePill}><Text style={styles.typeText}>{THREAD_TYPE_LABEL[thread.type]}</Text></View>
      </View>

      {/* 연결 먼저 (P2) */}
      <SectionLabel>연결 · {conns.length}</SectionLabel>
      <Card style={{ paddingVertical: 2 }}>
        {conns.map((c, i) => (
          <Pressable
            key={c.thread.id}
            onPress={() => router.push(`/thread/${c.thread.slug}`)}
            style={[styles.conn, i < conns.length - 1 && styles.connBorder]}
          >
            <View style={[styles.rel, c.tier === 2 && styles.relTier2]}>
              <Text style={styles.relText}>{RELATION_LABEL[c.relation_type]}</Text>
            </View>
            <Text style={styles.connName}>{c.thread.title}</Text>
            <Text style={styles.chev}>›</Text>
          </Pressable>
        ))}
      </Card>

      {/* AI Wiki — 접힘 */}
      <SectionLabel>소개 (AI 초안)</SectionLabel>
      <Card onPress={() => setOpen((v) => !v)}>
        <Text style={styles.quote}>{thread.summary}</Text>
        {open && (
          <Muted style={{ marginTop: space.sm, lineHeight: 20 }}>
            (본문은 AI Wiki가 먼저 작성한 초안이며, 이후 사용자가 관점과 자료로 보정합니다. — v0.2)
          </Muted>
        )}
        <Muted style={{ marginTop: space.sm }}>{open ? "접기 ⌃" : "본문 펼치기 ⌄"}</Muted>
      </Card>

      <Muted style={{ marginTop: space.lg }}>관점은 다음 단계에서 더해집니다.</Muted>

      {/* 저장 — save-first */}
      <View style={styles.saveBar}>
        <View style={{ transform: [{ scale: 1.1 }] }}>
          <SaveButton saved={isSaved(thread.id)} onPress={() => toggle(thread.id)} />
        </View>
      </View>
    </Screen>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    pills: { flexDirection: "row", gap: 6, marginTop: 6, alignItems: "center" },
    typePill: { backgroundColor: c.line2, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
    typeText: { fontSize: font.tiny, color: c.textMuted },

    conn: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: 10, paddingHorizontal: space.sm },
    connBorder: { borderBottomWidth: 1, borderBottomColor: c.line2 },
    rel: { backgroundColor: c.textMuted, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 1 },
    relTier2: { backgroundColor: c.accentActive },
    relText: { fontSize: 10, color: "#FFFFFF" },
    connName: { fontSize: font.body, fontWeight: "600", color: c.textMain },
    chev: { marginLeft: "auto", color: c.textMuted, fontSize: 18 },

    quote: { fontSize: font.body, fontWeight: "600", color: c.textMain, lineHeight: 22 },
    saveBar: { marginTop: space.xl, alignItems: "flex-start" },
  });

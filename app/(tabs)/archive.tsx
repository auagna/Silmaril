import { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { H1, Chip, Muted, Thumb } from "@/components/ui";
import { ThreadCard } from "@/components/cards/ThreadCard";
import { useSaves } from "@/features/saves/store";
import { threads } from "@/lib/dummy";
import { useTheme, space, radius, font, type Palette } from "@/theme";
import { useLocale } from "@/i18n";

type Tab = "saved" | "notes" | "collections";

const collections = [
  { id: "japan-arch", title: "일본 건축 순례", count: 8 },
  { id: "light-arch", title: "빛의 건축", count: 5 },
];

// Archive = 보관. 저장 / 기록(선택) / 컬렉션. (컬렉션은 여기, 별도 탭 아님)
export default function ArchiveScreen() {
  const c = useTheme().colors;
  const { t } = useLocale();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { savedSet, isSaved, toggle } = useSaves();
  const [tab, setTab] = useState<Tab>("saved");
  const savedThreads = threads.filter((th) => savedSet.has(th.id));

  return (
    <Screen>
      <H1>{t("archive")}</H1>
      <Muted style={{ marginTop: 4 }}>{t("archiveSubtitle")}</Muted>

      <View style={{ flexDirection: "row", marginTop: space.md }}>
        <Chip label={t("save")} active={tab === "saved"} onPress={() => setTab("saved")} />
        <Chip label={t("notes")} active={tab === "notes"} onPress={() => setTab("notes")} />
        <Chip label={t("collections")} active={tab === "collections"} onPress={() => setTab("collections")} />
      </View>

      {tab === "saved" && (
        <View style={{ marginTop: space.sm }}>
          {savedThreads.length === 0 ? (
            <Muted>{t("savedEmpty")}</Muted>
          ) : (
            savedThreads.map((th) => <ThreadCard key={th.id} thread={th} saved={isSaved(th.id)} onToggleSave={toggle} />)
          )}
        </View>
      )}

      {tab === "notes" && (
        <View style={{ marginTop: space.md }}>
          <Muted style={{ lineHeight: 20 }}>{t("notesEmpty")}</Muted>
        </View>
      )}

      {tab === "collections" && (
        <View style={styles.grid}>
          {collections.map((cl) => (
            <Pressable key={cl.id} style={styles.gcard}>
              <Thumb size={36} />
              <Text style={styles.gtitle}>{cl.title}</Text>
              <Muted>실마리 {cl.count}</Muted>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    grid: { flexDirection: "row", flexWrap: "wrap", gap: space.sm, marginTop: space.sm },
    gcard: { width: "48%", backgroundColor: c.surface, borderWidth: 1, borderColor: c.lineDefault, borderRadius: radius.md, padding: space.md, gap: 6 },
    gtitle: { fontSize: font.small, fontWeight: "600", color: c.textMain },
  });

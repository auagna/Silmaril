import { useMemo, type ReactNode } from "react";
import { Text, View, Pressable, StyleSheet, type ViewStyle, type TextStyle } from "react-native";
import { useTheme, space, radius, font, type Palette } from "@/theme";

function useS() {
  const c = useTheme().colors;
  return useMemo(() => makeStyles(c), [c]);
}

export function H1({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={[useS().h1, style]}>{children}</Text>;
}
export function H2({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={[useS().h2, style]}>{children}</Text>;
}
export function Body({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={[useS().body, style]}>{children}</Text>;
}
export function Muted({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={[useS().muted, style]}>{children}</Text>;
}
export function SectionLabel({ children }: { children: ReactNode }) {
  return <Text style={useS().sectionLabel}>{children}</Text>;
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: ViewStyle; onPress?: () => void }) {
  const s = useS();
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [s.card, style, pressed && { opacity: 0.7 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[s.card, style]}>{children}</View>;
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const s = useS();
  return (
    <Pressable onPress={onPress} style={[s.chip, active && s.chipActive]}>
      <Text style={[s.chipText, active && s.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

/** 저장 버튼 — 1탭. 저장됨 = accentActive(선택/활성). */
export function SaveButton({ saved, onPress }: { saved: boolean; onPress: () => void }) {
  const s = useS();
  return (
    <Pressable onPress={onPress} style={[s.save, saved && s.saveOn]} hitSlop={8}>
      <Text style={[s.saveText, saved && s.saveTextOn]}>{saved ? "저장됨" : "＋ 저장"}</Text>
    </Pressable>
  );
}

export function Thumb({ size = 46, label = "img" }: { size?: number; label?: string }) {
  const s = useS();
  return (
    <View style={[s.thumb, { width: size, height: size }]}>
      <Text style={s.thumbText}>{label}</Text>
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    h1: { fontSize: font.h1, fontWeight: "700", color: c.textMain, letterSpacing: -0.3 },
    h2: { fontSize: font.h2, fontWeight: "700", color: c.textMain },
    body: { fontSize: font.body, color: c.textMain, lineHeight: 22 },
    muted: { fontSize: font.small, color: c.textMuted },
    sectionLabel: {
      fontSize: font.tiny, fontWeight: "700", color: c.textMuted, letterSpacing: 0.6,
      textTransform: "uppercase", marginTop: space.lg, marginBottom: space.sm,
    },
    card: {
      backgroundColor: c.surface, borderWidth: 1, borderColor: c.lineDefault,
      borderRadius: radius.md, padding: space.md, marginBottom: space.sm,
    },
    chip: {
      borderWidth: 1, borderColor: c.lineDefault, borderRadius: radius.pill,
      paddingVertical: 5, paddingHorizontal: 11, backgroundColor: c.surface, marginRight: space.xs, marginBottom: space.xs,
    },
    chipActive: { backgroundColor: c.nodeDefault, borderColor: c.nodeDefault },
    chipText: { fontSize: font.small, color: c.textMuted },
    chipTextActive: { color: c.nodeText, fontWeight: "600" },
    save: {
      borderWidth: 1, borderColor: c.textMain, borderRadius: radius.pill,
      paddingVertical: 6, paddingHorizontal: 12, backgroundColor: "transparent",
    },
    saveOn: { backgroundColor: c.accentActive, borderColor: c.accentActive },
    saveText: { fontSize: font.small, fontWeight: "700", color: c.textMain },
    saveTextOn: { color: c.onAccent },
    thumb: {
      borderWidth: 1, borderColor: c.lineDefault, borderStyle: "dashed", borderRadius: radius.sm,
      alignItems: "center", justifyContent: "center", backgroundColor: c.line2,
    },
    thumbText: { fontSize: 9, color: c.textMuted },
  });

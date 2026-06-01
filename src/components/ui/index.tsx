import type { ReactNode } from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { colors, space, radius, font } from "@/constants/theme";

export function H1({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={[styles.h1, style]}>{children}</Text>;
}
export function H2({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={[styles.h2, style]}>{children}</Text>;
}
export function Body({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}
export function Muted({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={[styles.muted, style]}>{children}</Text>;
}
export function SectionLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: ViewStyle; onPress?: () => void }) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, style, pressed && { opacity: 0.7 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

/** 저장 버튼 — 1초 안에, 낙관적. (save-first) */
export function SaveButton({ saved, onPress }: { saved: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.save, saved && styles.saveOn]} hitSlop={8}>
      <Text style={[styles.saveText, saved && styles.saveTextOn]}>{saved ? "저장됨" : "＋ 저장"}</Text>
    </Pressable>
  );
}

export function Thumb({ size = 46, label = "img" }: { size?: number; label?: string }) {
  return (
    <View style={[styles.thumb, { width: size, height: size }]}>
      <Text style={styles.thumbText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: font.h1, fontWeight: "700", color: colors.ink900, letterSpacing: -0.3 },
  h2: { fontSize: font.h2, fontWeight: "700", color: colors.ink900 },
  body: { fontSize: font.body, color: colors.ink700, lineHeight: 22 },
  muted: { fontSize: font.small, color: colors.ink500 },
  sectionLabel: {
    fontSize: font.tiny,
    fontWeight: "700",
    color: colors.ink400,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: space.lg,
    marginBottom: space.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: space.md,
    marginBottom: space.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: 11,
    backgroundColor: colors.surface,
    marginRight: space.xs,
    marginBottom: space.xs,
  },
  chipActive: { backgroundColor: colors.ink900, borderColor: colors.ink900 },
  chipText: { fontSize: font.small, color: colors.ink500 },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  save: {
    borderWidth: 1,
    borderColor: colors.ink900,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
  },
  saveOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  saveText: { fontSize: font.small, fontWeight: "700", color: colors.ink900 },
  saveTextOn: { color: "#fff" },
  thumb: {
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: "dashed",
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.line2,
  },
  thumbText: { fontSize: 9, color: colors.ink400 },
});

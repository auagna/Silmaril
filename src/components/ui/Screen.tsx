import { useMemo, type ReactNode } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, space, type Palette } from "@/theme";

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const c = useTheme().colors;
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(c), [c]);
  const pad = { paddingTop: insets.top + space.md, paddingBottom: space.xxl };
  if (!scroll) {
    return <View style={[styles.base, pad, { flex: 1 }]}>{children}</View>;
  }
  return (
    <ScrollView style={styles.base} contentContainerStyle={[styles.content, pad]} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    base: { flex: 1, backgroundColor: c.bgMain },
    content: { paddingHorizontal: space.lg },
  });

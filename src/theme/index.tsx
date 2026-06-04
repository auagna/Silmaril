// 전역 테마 프로바이더 + useTheme 훅.
// 기본값 = 기기 시스템 설정(useColorScheme). setMode 로 사용자가 직접 변경(영속).
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { palettes, type Palette, type ThemeMode, type ColorScheme } from "./tokens";

export type { Palette, ThemeMode, ColorScheme };
export { space, radius, font } from "./tokens";

const THEME_KEY = "silmaril.themeMode";

interface ThemeContextValue {
  colors: Palette;
  scheme: ColorScheme; // 실제 적용된 light|dark
  mode: ThemeMode; // 사용자 선택 (system|light|dark)
  setMode: (mode: ThemeMode) => void;
  isNight: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setModeState] = useState<ThemeMode>("system");

  // 저장된 선택 로드 (1회). 없으면 system 유지.
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(THEME_KEY)
      .then((v) => {
        if (active && (v === "light" || v === "dark" || v === "system")) setModeState(v);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // 선택 변경 시 즉시 반영 + 영속.
  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(THEME_KEY, m).catch(() => {});
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const scheme: ColorScheme = mode === "system" ? (system === "dark" ? "dark" : "light") : mode;
    return {
      colors: palettes[scheme],
      scheme,
      mode,
      setMode,
      isNight: scheme === "dark",
    };
  }, [mode, system, setMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** 현재 테마. colors(팔레트) + mode 제어. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Provider 밖에서 호출 시 안전한 기본(라이트). (개발 중 보호)
    return {
      colors: palettes.light,
      scheme: "light",
      mode: "system",
      setMode: () => {},
      isNight: false,
    };
  }
  return ctx;
}

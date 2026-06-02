// Silmaril 테마 토큰 — Day Silmaril(light) / Night Silmaril(dark).
// 금색(accentRecommend)·주황(accentActive)은 추천/선택 상태에서만 제한적으로 사용.
// 판타지 UI 금지 — 절제된 탐험 도구 톤.

export type ThemeMode = "system" | "light" | "dark";
export type ColorScheme = "light" | "dark";

export interface Palette {
  // 배경
  bgMain: string; // 일반 화면
  bgMap: string; // 지도(Sea)
  bgSheet: string; // 하단 시트(Land)
  surface: string; // 카드 표면 (파생)
  // 텍스트
  textMain: string;
  textMuted: string;
  // 노드 / 라인
  nodeDefault: string;
  nodeText: string; // 노드 위 텍스트 (파생: nodeDefault 대비색)
  lineDefault: string;
  line2: string; // 옅은 구분선 (파생)
  // 강조 (제한적)
  accentRecommend: string; // 금색 — 추천
  accentActive: string; // 주황 — 선택/활성
  onAccent: string; // 강조 위 텍스트 (파생)
  // 상징
  silmarilCore: string;
}

export const dayPalette: Palette = {
  bgMain: "#F5F1E8",
  bgMap: "#E8EEF2",
  bgSheet: "#EFE4D2",
  surface: "#FFFDF5",
  textMain: "#1E252B",
  textMuted: "#7B756C",
  nodeDefault: "#26323A",
  nodeText: "#F5F1E8",
  lineDefault: "#D8D0C4",
  line2: "#ECE6DB",
  accentRecommend: "#D6A94A",
  accentActive: "#F47A3D",
  onAccent: "#FFFFFF",
  silmarilCore: "#FFFDF5",
};

export const nightPalette: Palette = {
  bgMain: "#070A12",
  bgMap: "#0B111C",
  bgSheet: "#17120F",
  surface: "#10151E",
  textMain: "#F3F0E8",
  textMuted: "#7D848C",
  nodeDefault: "#BFD6E2",
  nodeText: "#070A12",
  lineDefault: "#27445A",
  line2: "#1A2230",
  accentRecommend: "#D8B45A",
  accentActive: "#FF8A3D",
  onAccent: "#1E252B",
  silmarilCore: "#E8EEF2",
};

export const palettes: Record<ColorScheme, Palette> = {
  light: dayPalette,
  dark: nightPalette,
};

// 모드 비의존 토큰 (간격/모서리/타이포)
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;
export const font = { h1: 26, h2: 20, h3: 17, body: 15, small: 13, tiny: 11 } as const;

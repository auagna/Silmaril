// 디자인 토큰 (StyleSheet 기반). 톤: 조용한 탐험 도구 (Are.na/Apple HIG).
// Atlas/탐험은 어두운 표면으로 "세계를 밝힌다"는 감정.

export const colors = {
  bg: "#faf9f7",
  surface: "#ffffff",
  ink900: "#15130f",
  ink700: "#3a352d",
  ink500: "#6b6459",
  ink400: "#938b7d",
  line: "#e7e3db",
  line2: "#f0ede6",
  accent: "#1f6f5c", // forest — 저장/연결
  // Atlas(탐험) 어두운 표면
  atlasBg: "#0e1116",
  atlasSurface: "#161a22",
  atlasLine: "#252b36",
  atlasText: "#e8eaed",
  atlasMut: "#8a93a3",
  atlasGlow: "#7aa2ff",
  danger: "#b23b3b",
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;

export const font = {
  h1: 26,
  h2: 20,
  h3: 17,
  body: 15,
  small: 13,
  tiny: 11,
} as const;

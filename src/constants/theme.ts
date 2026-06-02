// 모드 비의존 토큰은 테마 시스템(src/theme/tokens)에서 단일 정의 → 재export (드리프트 방지).
export { space, radius, font } from "@/theme/tokens";

// ⚠️ Legacy 정적 색상 — 아직 테마 전환 안 한 화면(auth/*, thread/[id]) 폴백용.
// 신규/전환된 화면은 `useTheme()` 의 palette 를 사용한다. (Day 팔레트 근사)
export const colors = {
  bg: "#F5F1E8",
  surface: "#FFFDF5",
  ink900: "#1E252B",
  ink700: "#3a352d",
  ink500: "#7B756C",
  ink400: "#938b7d",
  line: "#D8D0C4",
  line2: "#ECE6DB",
  accent: "#1f6f5c",
  atlasBg: "#0e1116",
  atlasSurface: "#161a22",
  atlasLine: "#252b36",
  atlasText: "#e8eaed",
  atlasMut: "#8a93a3",
  atlasGlow: "#7aa2ff",
  danger: "#b23b3b",
} as const;

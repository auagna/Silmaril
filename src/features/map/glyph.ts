// 노드 타입별 시각 글리프 (PHASE 30). ★는 추천 전용 — 타입 글리프로 쓰지 않는다.
import type { ThreadType } from "@/types/database";

export const TYPE_GLYPH: { [K in ThreadType]: string } = {
  person: "●", // circle
  movement: "⬡", // hexagon
  work: "■", // square
  material: "◆", // diamond
  concept: "▬", // capsule
  emotion: "◌", // soft circle
  form: "▲", // triangle
  place: "⌖", // pin
  era: "│", // tick
  organization: "◇",
};

/**
 * 제목 → URL slug. 한글/숫자/영문은 보존하고 그 외 구분자는 하이픈으로.
 * 유니코드 letter/number 를 살리므로 "디터 람스" → "디터-람스".
 */
export function createSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

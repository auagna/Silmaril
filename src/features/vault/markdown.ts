// Markdown-first 저장 철학(D-021, docs/storage-model.md)의 v0.1 구현체.
// 실제 파일 sync는 없음 — 모든 기록(thread/viewpoint)이 YAML frontmatter + 본문의
// Markdown으로 무손실 export 가능함을 이 모듈이 보장한다.
// 파일명은 사용자 기준: 강제하지 않고 OS 금지 문자만 제거한다. 식별자는 frontmatter.id.
import type { Thread, ThreadTranslation, Viewpoint } from "@/types/database";

export interface VaultFile {
  fileName: string; // "….md" — 사용자 지정 우선
  content: string; // frontmatter + 본문
}

type FmValue = string | number | boolean | string[] | null | undefined;

// 값에 YAML 특수문자/경계 공백이 있으면 따옴표로 감싼다.
function needsQuote(s: string): boolean {
  if (s === "") return true;
  if (s.trim() !== s) return true;
  const specials = ":#[]{}&*!|>'\"%@`,";
  for (const ch of s) if (specials.includes(ch)) return true;
  return false;
}
function fmScalar(v: string | number | boolean): string {
  if (typeof v !== "string") return String(v);
  if (!needsQuote(v)) return v;
  return `"${v.split("\\").join("\\\\").split('"').join('\\"')}"`;
}
function unquote(s: string): string {
  const t = s.trim();
  if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) {
    return t.slice(1, -1).split('\\"').join('"').split("\\\\").join("\\");
  }
  return t;
}

export function serializeFrontmatter(data: Record<string, FmValue>): string {
  const lines: string[] = ["---"];
  for (const [key, v] of Object.entries(data)) {
    if (v == null) continue;
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      lines.push(`${key}:`);
      for (const item of v) lines.push(`  - ${fmScalar(item)}`);
    } else {
      lines.push(`${key}: ${fmScalar(v)}`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}

/** Silmaril이 생성한 frontmatter 부분집합(평면 키 + 문자열 목록)을 파싱. 범용 YAML 파서 아님. */
export function parseFrontmatter(content: string): {
  frontmatter: Record<string, string | string[]>;
  body: string;
} {
  if (!content.startsWith("---\n")) return { frontmatter: {}, body: content };
  const end = content.indexOf("\n---", 4);
  if (end < 0) return { frontmatter: {}, body: content };
  const block = content.slice(4, end);
  const body = content.slice(end + 4).replace(/^\n+/, "");
  const fm: Record<string, string | string[]> = {};
  let listKey: string | null = null;
  for (const line of block.split("\n")) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) {
      (fm[listKey] as string[]).push(unquote(item[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_]+):(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    const raw = kv[2].trim();
    if (raw === "") {
      fm[key] = [];
      listKey = key;
    } else {
      fm[key] = unquote(raw);
      listKey = null;
    }
  }
  return { frontmatter: fm, body };
}

/** OS 금지 문자만 제거 — 한국어·공백·자유 형식 보존. 파일명은 식별자가 아니다. */
const FORBIDDEN_FILE_CHARS = '\\/:*?"<>|';
export function sanitizeFileName(name: string): string {
  let out = "";
  for (const ch of name) {
    out += ch.charCodeAt(0) < 32 || FORBIDDEN_FILE_CHARS.includes(ch) ? " " : ch;
  }
  return out.replace(/\s+/g, " ").trim();
}

/** 사용자 파일명 우선. 없으면 fallback. 항상 .md 확장자. */
export function exportFileName(userFileName: string | null | undefined, fallback: string): string {
  let base = sanitizeFileName(userFileName ?? fallback);
  if (base === "") base = sanitizeFileName(fallback) || "note";
  if (base.toLowerCase().endsWith(".md")) base = base.slice(0, -3).trim();
  return `${base}.md`;
}

/** 관점(viewpoint) → Markdown. 기본 파일명 = {날짜}_{제목}.md, 사용자 지정 우선. */
export function viewpointToMarkdown(vp: Viewpoint, userFileName?: string): VaultFile {
  const date = (vp.created_at ?? "").slice(0, 10);
  const fm = serializeFrontmatter({
    id: vp.id,
    type: "perspective",
    related_threads: [vp.thread_id],
    locale: vp.locale,
    author_type: vp.author_type,
    visibility: "private",
    created_at: date,
  });
  const content = `${fm}\n\n# ${vp.title}\n\n${vp.body}\n`;
  return { fileName: exportFileName(userFileName, `${date}_${vp.title}`), content };
}

/** 실마리(thread) + 번역 → Markdown. 기본 파일명 = {제목}.md. */
export function threadToMarkdown(
  thread: Thread,
  translations: ThreadTranslation[] = [],
  userFileName?: string,
): VaultFile {
  const fm = serializeFrontmatter({
    id: thread.slug || thread.id,
    type: "thread",
    thread_type: thread.type,
    subtype: thread.subtype ?? undefined,
    status: thread.status,
    created_at: (thread.created_at ?? "").slice(0, 10),
  });
  const parts: string[] = [`# ${thread.title}`];
  if (thread.summary) parts.push(thread.summary);
  for (const tr of translations.filter((x) => x.thread_id === thread.id)) {
    parts.push(`## ${tr.locale}`, `**${tr.title}**`, tr.summary);
  }
  const content = `${fm}\n\n${parts.join("\n\n")}\n`;
  return { fileName: exportFileName(userFileName, thread.title), content };
}

// D-021 Markdown-first — export-ready 보장 테스트 (라운드트립 + 파일명 자유).
import {
  exportFileName,
  parseFrontmatter,
  sanitizeFileName,
  serializeFrontmatter,
  threadToMarkdown,
  viewpointToMarkdown,
} from "./markdown";
import type { Thread, Viewpoint, ThreadTranslation } from "@/types/database";

const vp: Viewpoint = {
  id: "vp-ando-user-ko",
  thread_id: "tadao-ando",
  locale: "ko",
  author_type: "user",
  title: "빛이 먼저다",
  body: "안도의 공간은 콘크리트가 아니라 빛으로 기억된다.",
  created_at: "2026-06-10T09:00:00Z",
};

const thread: Thread = {
  id: "t1",
  title: "Tadao Ando",
  slug: "tadao-ando",
  type: "person",
  subtype: null,
  summary: null,
  description: null,
  cover_image_url: null,
  status: "community",
  created_by: null,
  trust_score: 0,
  completion_score: 0,
  merged_into_thread_id: null,
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z",
};

const tr: ThreadTranslation = {
  id: "t1-ko",
  thread_id: "t1",
  locale: "ko",
  title: "안도 다다오",
  summary: "빛·노출 콘크리트·침묵의 건축가.",
};

describe("vault/markdown (D-021 export-ready)", () => {
  test("viewpoint → markdown → frontmatter 라운드트립", () => {
    const file = viewpointToMarkdown(vp);
    const { frontmatter, body } = parseFrontmatter(file.content);
    expect(frontmatter.id).toBe("vp-ando-user-ko");
    expect(frontmatter.type).toBe("perspective");
    expect(frontmatter.related_threads).toEqual(["tadao-ando"]);
    expect(frontmatter.visibility).toBe("private");
    expect(frontmatter.created_at).toBe("2026-06-10");
    expect(body).toContain("# 빛이 먼저다");
    expect(body).toContain("빛으로 기억된다");
  });

  test("파일명: 사용자 기준 우선 — 한국어/공백 보존, 강제 변경 없음", () => {
    expect(exportFileName("빛과 침묵에 대한 안도 생각", "fallback")).toBe("빛과 침묵에 대한 안도 생각.md");
    expect(exportFileName("2026-06-10_빛의교회_메모", "fallback")).toBe("2026-06-10_빛의교회_메모.md");
  });

  test("파일명: OS 금지 문자만 제거", () => {
    expect(sanitizeFileName('안도: 빛/콘크리트?')).toBe("안도 빛 콘크리트");
    expect(exportFileName(null, `${"2026-06-10"}_${vp.title}`)).toBe("2026-06-10_빛이 먼저다.md");
  });

  test("thread → markdown: 번역 포함 + frontmatter", () => {
    const file = threadToMarkdown(thread, [tr]);
    expect(file.fileName).toBe("Tadao Ando.md");
    const { frontmatter, body } = parseFrontmatter(file.content);
    expect(frontmatter.id).toBe("tadao-ando");
    expect(frontmatter.type).toBe("thread");
    expect(frontmatter.thread_type).toBe("person");
    expect(body).toContain("# Tadao Ando");
    expect(body).toContain("## ko");
    expect(body).toContain("안도 다다오");
  });

  test("frontmatter: 특수문자 값(콜론 등) 따옴표 라운드트립", () => {
    const fm = serializeFrontmatter({ id: "n1", type: "record", note: "빛: 침묵의 재료" });
    const parsed = parseFrontmatter(`${fm}\n\n본문`);
    expect(parsed.frontmatter.note).toBe("빛: 침묵의 재료");
    expect(parsed.body).toBe("본문");
  });
});

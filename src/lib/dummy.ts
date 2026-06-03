// MVP 더미 데이터 — Thread(canonical) + ko/en 번역 + 관점 + 관계.
// 스키마(supabase/schema.sql)와 동일 필드명. EXP4에서 Supabase service/seed 로 대체.
import type {
  Thread,
  ThreadConnection,
  ThreadTranslation,
  Viewpoint,
  RelationType,
  ThreadType,
  ConnectionTier,
} from "@/types/database";
import type { Locale } from "@/i18n";

function t(id: string, title: string, type: ThreadType): Thread {
  return {
    id,
    title, // canonical (영문)
    slug: id,
    type,
    subtype: null,
    summary: null, // 표시 텍스트는 번역에서
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
}

export const threads: Thread[] = [
  t("mies-van-der-rohe", "Mies van der Rohe", "person"),
  t("tadao-ando", "Tadao Ando", "person"),
  t("bauhaus", "Bauhaus", "movement"),
  t("less-is-more", "Less is More", "concept"),
  t("concrete", "Concrete", "material"),
  t("silence", "Silence", "emotion"),
  t("light", "Light", "concept"),
  t("modernism", "Modernism", "movement"),
  t("japanese-minimalism", "Japanese Minimalism", "movement"),
  t("church-of-the-light", "Church of the Light", "work"),
];

function tr(thread_id: string, locale: Locale, title: string, summary: string): ThreadTranslation {
  return { id: `${thread_id}-${locale}`, thread_id, locale, title, summary };
}

export const threadTranslations: ThreadTranslation[] = [
  tr("mies-van-der-rohe", "ko", "미스 반 데어 로에", "근대 건축의 핵심 인물. 구조적 명료성과 절제로 “Less is More”라는 태도를 보여준 건축가."),
  tr("mies-van-der-rohe", "en", "Mies van der Rohe", "A central figure of modern architecture, known for structural clarity, restraint, and the attitude “Less is More.”"),
  tr("tadao-ando", "ko", "안도 다다오", "빛, 노출 콘크리트, 침묵, 여백을 주요한 공간 언어로 쓰는 일본의 건축가."),
  tr("tadao-ando", "en", "Tadao Ando", "A Japanese architect using light, exposed concrete, silence, and emptiness as core spatial languages."),
  tr("bauhaus", "ko", "바우하우스", "교육 혁명이자 산업화의 산물. 근대 디자인의 출발점이 된 학교이자 사조."),
  tr("bauhaus", "en", "Bauhaus", "A school and movement at the root of modern design — part education revolution, part industrial child."),
  tr("less-is-more", "ko", "레스 이즈 모어", "덜어냄으로 본질에 다가가는 태도. 미스의 언어로 요약되는 절제의 미학."),
  tr("less-is-more", "en", "Less is More", "An attitude that reaches the essential by removing — restraint as a way of seeing."),
  tr("concrete", "ko", "콘크리트", "거칠고 정직한 물성. 빛을 받아들이는 표면이자 침묵의 재료."),
  tr("concrete", "en", "Concrete", "A raw, honest material — a surface that receives light and holds silence."),
  tr("silence", "ko", "침묵", "비움으로 채우는 공간의 정서. 안도 건축의 핵심 분위기."),
  tr("silence", "en", "Silence", "An atmosphere that fills space by emptying it — central to Ando’s architecture."),
  tr("light", "ko", "빛", "공간을 드러내고 침묵을 빚는 근본 재료. 여러 건축가를 잇는 실마리."),
  tr("light", "en", "Light", "The fundamental material that reveals space and shapes silence — a thread across architects."),
  tr("modernism", "ko", "모더니즘", "기능과 형태의 명료함을 추구한 20세기의 거대한 흐름."),
  tr("modernism", "en", "Modernism", "A sweeping 20th-century movement pursuing clarity of function and form."),
  tr("japanese-minimalism", "ko", "일본 미니멀리즘", "여백과 절제, 자연과의 관계를 중시하는 일본 특유의 미감."),
  tr("japanese-minimalism", "en", "Japanese Minimalism", "A Japanese sensibility valuing emptiness, restraint, and a relationship with nature."),
  tr("church-of-the-light", "ko", "빛의 교회", "콘크리트 벽의 십자형 틈으로 빛을 들이는 안도의 대표작."),
  tr("church-of-the-light", "en", "Church of the Light", "Ando’s signature work, where a cruciform slit lets light pour through a concrete wall."),
];

export const viewpoints: Viewpoint[] = [
  {
    id: "vp-ando-user-ko", thread_id: "tadao-ando", locale: "ko", author_type: "user",
    title: "빛이 먼저다", body: "안도의 공간은 콘크리트가 아니라 빛으로 기억된다.",
    created_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "vp-ando-curator-en", thread_id: "tadao-ando", locale: "en", author_type: "curator",
    title: "Silence as material", body: "Ando treats emptiness as something you can build with.",
    created_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "vp-light-curator-ko", thread_id: "light", locale: "ko", author_type: "curator",
    title: "빛은 연결한다", body: "칸에서 안도, 스카르파로 이어지는 공통분모는 빛이다.",
    created_at: "2026-06-01T00:00:00Z",
  },
];

function conn(from: string, to: string, relation_type: RelationType, tier: ConnectionTier): ThreadConnection {
  return {
    id: `${from}__${to}`, from_thread_id: from, to_thread_id: to, relation_type,
    connection_tier: tier, description: null, created_by: null, status: "community",
    trust_score: 0, created_at: "2026-06-01T00:00:00Z",
  };
}

export const connections: ThreadConnection[] = [
  conn("mies-van-der-rohe", "tadao-ando", "influenced", 1),
  conn("mies-van-der-rohe", "bauhaus", "belongs_to", 1),
  conn("mies-van-der-rohe", "less-is-more", "shares_theme", 2),
  conn("mies-van-der-rohe", "modernism", "belongs_to", 1),
  conn("tadao-ando", "concrete", "related_to", 2),
  conn("tadao-ando", "silence", "related_to", 2),
  conn("tadao-ando", "light", "related_to", 2),
  conn("tadao-ando", "japanese-minimalism", "belongs_to", 1),
  conn("tadao-ando", "church-of-the-light", "created", 1),
  conn("church-of-the-light", "light", "related_to", 2),
  conn("modernism", "bauhaus", "related_to", 1),
];

// 사용자가 "저장한" 더미 실마리.
export const savedIds = ["tadao-ando", "light"];

// 추천 실마리(나침반 ★ 후보). 추후 추천 알고리즘/AI 로 대체.
export const recommendedIds = ["mies-van-der-rohe", "light", "bauhaus"];

export function getThreadById(id: string): Thread | undefined {
  return threads.find((x) => x.id === id || x.slug === id);
}

/** locale 기준 표시 텍스트. fallback: locale → ko → en → canonical. */
export function getThreadTranslation(
  threadId: string,
  locale: Locale,
): { title: string; summary: string; description?: string | null } {
  const all = threadTranslations.filter((x) => x.thread_id === threadId);
  const pick = all.find((x) => x.locale === locale) ?? all.find((x) => x.locale === "ko") ?? all.find((x) => x.locale === "en");
  if (pick) return { title: pick.title, summary: pick.summary, description: pick.description };
  const th = getThreadById(threadId);
  return { title: th?.title ?? threadId, summary: th?.summary ?? "" };
}

/** 관점: 현재 locale 우선 정렬, 없으면 다른 언어도 포함(언어 라벨은 UI에서). */
export function getViewpoints(threadId: string, locale: Locale): Viewpoint[] {
  return viewpoints
    .filter((v) => v.thread_id === threadId)
    .sort((a, b) => (a.locale === locale ? -1 : 0) - (b.locale === locale ? -1 : 0));
}

export function searchThreads(q: string, type?: ThreadType): Thread[] {
  const ql = q.trim().toLowerCase();
  if (ql === "") return type ? threads.filter((x) => x.type === type) : threads;
  return threads.filter((x) => {
    if (type && x.type !== type) return false;
    if (x.title.toLowerCase().includes(ql)) return true;
    return threadTranslations.some(
      (tt) => tt.thread_id === x.id && (tt.title.toLowerCase().includes(ql) || tt.summary.toLowerCase().includes(ql)),
    );
  });
}

export function connectionsOf(
  threadId: string,
): { thread: Thread; relation_type: RelationType; tier: ConnectionTier }[] {
  const out: { thread: Thread; relation_type: RelationType; tier: ConnectionTier }[] = [];
  for (const c of connections) {
    if (c.from_thread_id === threadId) {
      const th = getThreadById(c.to_thread_id);
      if (th) out.push({ thread: th, relation_type: c.relation_type, tier: c.connection_tier });
    } else if (c.to_thread_id === threadId) {
      const th = getThreadById(c.from_thread_id);
      if (th) out.push({ thread: th, relation_type: c.relation_type, tier: c.connection_tier });
    }
  }
  return out;
}

export function undiscovered(): Thread[] {
  const seen = new Set(savedIds);
  const out = new Map<string, Thread>();
  for (const id of savedIds) {
    for (const { thread } of connectionsOf(id)) {
      if (!seen.has(thread.id)) out.set(thread.id, thread);
    }
  }
  return [...out.values()];
}

export const exploreProgress = [
  { label: "Light / Silence", pct: 38 },
  { label: "Modernism", pct: 24 },
  { label: "Japan", pct: 18 },
];

// 다국어(ko/en). 기본 = 기기 언어, 미지원이면 ko. setLocale 로 즉시 전환.
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Locale = "ko" | "en";
export const SUPPORTED_LOCALES: Locale[] = ["ko", "en"];

export const translations = {
  ko: {
    map: "Map",
    archive: "Archive",
    create: "Create",
    myView: "My View",
    overview: "기본정보",
    views: "관점",
    userViews: "사용자 관점",
    curatorViews: "큐레이터 관점",
    connections: "연결",
    save: "저장",
    saved: "저장됨",
    selectThread: "실마리를 선택해 탐험을 시작하세요",
    recommendedThread: "추천 실마리",
    // 확장
    today: "오늘의 발견",
    recommend: "추천",
    newTraces: "새로운 흔적",
    undiscovered: "미발견",
    illuminating: "내 세계를 밝히는 중",
    close: "닫기",
    addCollection: "컬렉션 추가",
    notes: "기록",
    collections: "컬렉션",
    myMap: "내 지도",
    litWorld: "밝힌 세계",
    tasteKeywords: "취향 키워드",
    mapHint: "노드를 눌러 실마리를 펼치고, 연결을 따라가 보세요.",
    createSubtitle: "완벽하지 않아도 됩니다. 먼저 남기고, 나중에 잇기.",
    archiveSubtitle: "담아둔 것들. 컬렉션도 여기 있어요.",
    notesEmpty: "기록은 선택이에요. 저장만으로도 지도는 자랍니다.",
    savedEmpty: "아직 저장한 실마리가 없어요. 지도에서 하나 저장해 보세요.",
    language: "언어",
  },
  en: {
    map: "Map",
    archive: "Archive",
    create: "Create",
    myView: "My View",
    overview: "Overview",
    views: "Views",
    userViews: "User Views",
    curatorViews: "Curator Views",
    connections: "Connections",
    save: "Save",
    saved: "Saved",
    selectThread: "Select a thread to begin exploring.",
    recommendedThread: "Recommended Thread",
    today: "Daily Discovery",
    recommend: "Recommended",
    newTraces: "New Traces",
    undiscovered: "Undiscovered",
    illuminating: "Illuminating your world",
    close: "Close",
    addCollection: "Add to Collection",
    notes: "Notes",
    collections: "Collections",
    myMap: "My Map",
    litWorld: "Illuminated",
    tasteKeywords: "Taste Keywords",
    mapHint: "Tap a node to open a thread and follow its connections.",
    createSubtitle: "It doesn’t need to be perfect. Leave it now, connect it later.",
    archiveSubtitle: "Things you’ve kept. Collections live here too.",
    notesEmpty: "Notes are optional. Saving alone grows your map.",
    savedEmpty: "Nothing saved yet. Save a thread from the map.",
    language: "Language",
  },
} as const;

export type UIKey = keyof (typeof translations)["ko"];

function detectDeviceLocale(): Locale {
  try {
    const loc = (Intl.DateTimeFormat().resolvedOptions().locale || "").toLowerCase();
    if (loc.startsWith("en")) return "en";
    if (loc.startsWith("ko")) return "ko";
  } catch {
    // Intl 미지원 환경 대비
  }
  return "ko"; // 미지원 언어 → ko 기본
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: UIKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectDeviceLocale());

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => translations[locale][key] ?? translations.ko[key] ?? String(key),
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return { locale: "ko", setLocale: () => {}, t: (key) => translations.ko[key] ?? String(key) };
  }
  return ctx;
}

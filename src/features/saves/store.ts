// 저장(bookmark) 전역 store — 더미 MVP용. (EXP4에서 Supabase saveThread/unsaveThread 로 대체)
// save-first: 토글은 즉시(낙관적). useSyncExternalStore 로 화면 간 공유.
import { useSyncExternalStore } from "react";
import { savedIds } from "@/lib/dummy";

let saved = new Set<string>(savedIds);
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function toggleSave(id: string) {
  const next = new Set(saved);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  saved = next;
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return saved;
}

export function useSaves() {
  const set = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    savedSet: set,
    isSaved: (id: string) => set.has(id),
    toggle: toggleSave,
    count: set.size,
  };
}

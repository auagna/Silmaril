// 탐험 상태 — 방문(visited) 추적. (PHASE 16/21) 더미; 추후 user_keyword_visits 로.
import { useSyncExternalStore } from "react";

let visited = new Set<string>();
const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}

export function markVisited(id: string) {
  if (visited.has(id)) return;
  const next = new Set(visited);
  next.add(id);
  visited = next;
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function getSnapshot() {
  return visited;
}

export function useVisited() {
  const set = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { visitedSet: set, isVisited: (id: string) => set.has(id), markVisited, count: set.size };
}

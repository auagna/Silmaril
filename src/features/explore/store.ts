// 탐험 전역 상태 — 선택(selectedId) + 방문(visited). (PHASE 16/21/35)
// 더미; 추후 user_keyword_visits + 서버 동기화로.
import { useSyncExternalStore } from "react";

interface ExploreState {
  selectedId: string | null;
  visited: Set<string>;
}

let state: ExploreState = { selectedId: null, visited: new Set() };
const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}

/** 선택 변경. id 가 있으면 visited 에도 기록. */
export function setSelected(id: string | null) {
  const visited = state.visited;
  let nextVisited = visited;
  if (id && !visited.has(id)) {
    nextVisited = new Set(visited);
    nextVisited.add(id);
  }
  state = { selectedId: id, visited: nextVisited };
  emit();
}

export function markVisited(id: string) {
  if (state.visited.has(id)) return;
  const nextVisited = new Set(state.visited);
  nextVisited.add(id);
  state = { ...state, visited: nextVisited };
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function getSnapshot() {
  return state;
}

export function useExplore() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    selectedId: s.selectedId,
    setSelected,
    visitedSet: s.visited,
    isVisited: (id: string) => s.visited.has(id),
    visitedCount: s.visited.size,
    markVisited,
  };
}

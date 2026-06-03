// Review Queue mock store (PHASE 42). 승인 전 후보는 일반 화면에 노출하지 않는다.
// 추후 Supabase review_candidates 로. 승인된 것만 실제 Keyword/Relation 으로 변환.
import { useSyncExternalStore } from "react";
import type { ReviewCandidate, ReviewStatus } from "./types";

let queue: ReviewCandidate[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function enqueueCandidates(items: ReviewCandidate[]) {
  queue = [...items, ...queue];
  emit();
}

export function setReviewStatus(id: string, status: ReviewStatus) {
  queue = queue.map((q) => (q.id === id ? { ...q, status, reviewedAt: new Date().toISOString() } : q));
  emit();
}

export function getPending(): ReviewCandidate[] {
  return queue.filter((q) => q.status === "pending");
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function getSnapshot() {
  return queue;
}

export function useReviewQueue() {
  const q = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    all: q,
    pending: q.filter((x) => x.status === "pending"),
    setStatus: setReviewStatus,
  };
}

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { readSavedPlaces, toggleSaved, type SavedPlace } from '@/lib/storage';

/**
 * 저장 목록 하나를 화면들이 함께 본다. 저장소는 변경을 알려주지 않아서
 * 이 모듈이 구독자 목록을 들고 직접 알린다.
 */
const listeners = new Set<() => void>();

/** 매번 새 배열을 돌려주면 Object.is 비교가 늘 실패해 렌더가 멈추지 않는다 */
let cache: SavedPlace[] | null = null;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): SavedPlace[] {
  if (cache === null) cache = readSavedPlaces();
  return cache;
}

function invalidate(): void {
  cache = null;
  for (const listener of listeners) listener();
}

export function useSavedPlaces() {
  const places = useSyncExternalStore(subscribe, getSnapshot);
  const ids = useMemo(() => new Set(places.map((p) => p.id)), [places]);

  const toggle = useCallback((contentId: string) => {
    toggleSaved(contentId);
    invalidate();
  }, []);

  return { places, ids, toggle };
}

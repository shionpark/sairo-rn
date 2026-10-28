import { rankPlaces, type EnginePlaceInput } from '@/lib/recommendEngine';
import { createMMKV } from 'react-native-mmkv';
import {
  STORAGE_KEYS, markJustDiagnosed, readCf8Code, readJustDiagnosed, readSavedIdsKey, toggleSaved,
} from '@/lib/storage';

const empty = {
  weatherType: null, isRestaurant: null, barrierFree: null, petAllowed: null,
  soloScore: null, coupleFriendScore: null, parentsScore: null, kidsScore: null, petScore: null,
  sunnyScore: null, rainyScore: null, cloudyScore: null,
  springScore: null, summerScore: null, autumnScore: null, winterScore: null,
  morningScore: null, afternoonScore: null, eveningScore: null,
  energyScore: null, landmarkScore: null, diverseExperienceScore: null,
  contentId: null, whyKo: null, whyEn: null,
} satisfies Partial<EnginePlaceInput>;

const place = (name: string, c: number, l: number, d: number) => ({
  ...empty, name, calmnessScore: c, localScore: l, stayDeeplyScore: d,
});

export function logEngineCheck() {
  const ranked = rankPlaces([place('C', 0, 0, 0), place('A', 3, 3, 3), place('B', 2, 1, 1)], {
    cf8Code: 'CLD',
    mode: 'QUICK',
    tripSetup: null,
    weather: null,
    now: new Date('2026-09-29T12:00:00+09:00'),
  });
  console.log(
    '[engineCheck]',
    ranked.slice(0, 3).map((p) => `${p.rank}. ${p.name} ${p.fitScore.toFixed(1)}`)
  );
}

const snapshot = () => ({
  cf8: readCf8Code(), justDiagnosed: readJustDiagnosed(), saved: readSavedIdsKey(),
});

/** 재시작 뒤 before에 cf8 · saved가 남고 justDiagnosed만 false면 통과. saved는 실행마다 뒤집힌다 */
export function logStorageCheck() {
  console.log('[storageCheck] before', snapshot());
  createMMKV().set(STORAGE_KEYS.cf8Code, '"CLD"');
  markJustDiagnosed();
  toggleSaved('test');
  console.log('[storageCheck] after', snapshot());
}

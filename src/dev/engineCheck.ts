import { rankPlaces, type EnginePlaceInput } from '@/lib/recommendEngine';
import { STORAGE_KEYS, localStorage, readCf8Code } from '@/lib/storage';

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

/** 진단 화면이 없어 고정 유형으로 시작한다. 화면이 첫 렌더에 읽으므로 렌더 전에 불러야 한다 */
export function seedCf8Code() {
  if (!readCf8Code()) localStorage.setItem(STORAGE_KEYS.cf8Code, '"CLD"');
}

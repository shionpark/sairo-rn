import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SaveButton } from './SaveButton';
import { draftPlaceType } from '@/data/placeTypeDraft';
import { districtLabel, secureImageUrl } from '@/lib/placeDisplay';
import type { RecommendedPlace } from '@/types/place';
import ko from '../../../messages/ko.json';

const PLACE_TYPE: Record<string, string> = ko.place.placeType;

/**
 * S10 추천 피드의 사진 카드. 사진 → 메타(구 · 유형 · 실내외) → 장소명 → 설명.
 * 사진은 첫 장만 쓴다(웹의 좌우 넘김은 제외). 탭하면 상세로 간다.
 */
export function PlaceCard({
  place,
  saved,
  onToggleSave,
}: {
  place: RecommendedPlace;
  saved: boolean;
  onToggleSave: (contentId: string) => void;
}) {
  const image = place.firstImage ?? place.images[0] ?? null;
  const placeType = place.placeType ?? draftPlaceType(place);
  const meta = [
    districtLabel(place.addr1),
    placeType && (PLACE_TYPE[placeType] ?? placeType),
    place.weatherType ? ko.place.weatherType[place.weatherType] : null,
  ].filter(Boolean);

  return (
    <Pressable
      onPress={() => router.push(`/place/${place.contentId}`)}
      className="px-gutter py-4 active:opacity-70"
    >
      <View className="aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
        {image && (
          <Image source={secureImageUrl(image)} contentFit="cover" style={{ flex: 1 }} transition={150} />
        )}
        <SaveButton
          saved={saved}
          onToggle={() => onToggleSave(place.contentId)}
          placeName={place.title}
          onScrim={Boolean(image)}
          className="absolute right-1 top-1"
        />
      </View>

      {meta.length > 0 && (
        <Text className="mt-3 text-ds-caption font-semibold text-sub">{meta.join(' · ')}</Text>
      )}
      <Text className="mt-0.5 text-ds-title-1 text-ink">{place.title}</Text>
      {place.whyKo && <Text className="mt-1 text-ds-body-2 text-ink">{place.whyKo}</Text>}
    </Pressable>
  );
}

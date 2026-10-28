import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PlaceCard } from '@/components/place/PlaceCard';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useSavedPlaces } from '@/hooks/useSavedPlaces';
import { CF8_PROFILES } from '@/data/cf8Profiles';
import { FeedSkeleton } from './FeedSkeleton';
import { EmptyState, ListHeader, ScreenTitle } from './TabScreen';
import { TasteSummary } from './TasteSummary';
import ko from '../../../messages/ko.json';

/**
 * S10 추천 피드. 유형 → 상황 → 목록 순으로 "이 기준으로 골랐다"를 먼저 선언한다.
 * 날씨는 관측 사실만 적는다.
 */
export function FeedContent() {
  const {
    places, loading, error, code, retry,
    weather, temperature, forecastSlot, weatherFailed, weatherLoading, reloadWeather,
  } = useRecommendations();
  const { ids: savedIds, toggle } = useSavedPlaces();

  if (loading) return <FeedSkeleton />;

  const copy = code ? CF8_PROFILES.ko[code] : null;
  const weatherLabel = weather ? ko.feed.weather[weather] : null;

  const header = (
    <>
      <ScreenTitle>{ko.feed.title}</ScreenTitle>

      {/* 목록을 못 받았으면 박스 · 정렬 라벨을 숨기고 재시도만 남긴다 */}
      {error === null && (
        <>
          {copy && (
            <View className="mt-4">
              <TasteSummary copy={copy} />
            </View>
          )}
          <ListHeader aside={code ? ko.feed.sortByMatch : ko.feed.sortByLandmark}>
            {weatherLabel && (
              <>
                {temperature !== null && (
                  <Text className="text-ds-caption font-semibold text-ink">{Math.round(temperature)}°</Text>
                )}
                <Text numberOfLines={1} className="text-ds-caption text-sub">
                  {forecastSlot
                    ? ko.feed.nowIn
                        .replace('{weather}', weatherLabel)
                        .replace('{time}', `${forecastSlot.time.slice(0, 2)}:${forecastSlot.time.slice(2)}`)
                    : ko.feed.nowInNoTime.replace('{weather}', weatherLabel)}
                </Text>
              </>
            )}
            {!weather && !weatherLoading && weatherFailed && (
              <>
                <Text numberOfLines={1} className="text-ds-caption text-sub">{ko.feed.weatherFailed}</Text>
                <Pressable
                  onPress={reloadWeather}
                  accessibilityLabel={ko.feed.reloadWeather}
                  className="-my-3.5 size-11 items-center justify-center"
                >
                  <Ionicons name="refresh" size={16} color="#101318" />
                </Pressable>
              </>
            )}
          </ListHeader>
        </>
      )}

      {error === 'LOAD_FAILED' && (
        <EmptyState
          title={ko.feed.loadFailed.title}
          body={ko.feed.loadFailed.body}
          onAction={retry}
          actionLabel={ko.feed.loadFailed.action}
        />
      )}

      {error === null && places.length === 0 && (
        <EmptyState title={ko.feed.noResults.title} body={ko.feed.noResults.body} />
      )}
      <View className="h-2" />
    </>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-page">
      <FlatList
        data={error === null ? places : []}
        keyExtractor={(p) => p.contentId}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <PlaceCard place={item} saved={savedIds.has(item.contentId)} onToggleSave={toggle} />
        )}
        onRefresh={retry}
        refreshing={false}
      />
    </SafeAreaView>
  );
}

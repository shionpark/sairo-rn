import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '@/components/Skeleton';
import { PlaceCardSkeleton } from '@/components/place/PlaceCardSkeleton';
import { ListHeader, ScreenTitle } from './TabScreen';
import { TasteSummarySkeleton } from './TasteSummary';
import ko from '../../../messages/ko.json';

/**
 * 추천 피드가 채워질 자리. 본문과 같은 순서 · 높이로 쌓는다.
 * 제목과 정렬 기준은 정적 문구라 실제 글로 그린다.
 */
export function FeedSkeleton() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-page">
      <ScrollView scrollEnabled={false}>
        <ScreenTitle>{ko.feed.title}</ScreenTitle>
        <View className="mt-4">
          <TasteSummarySkeleton />
        </View>
        <ListHeader aside={ko.feed.sortByMatch}>
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-3 w-28" />
        </ListHeader>
        <View className="mt-2">
          {[0, 1, 2].map((i) => (
            <PlaceCardSkeleton key={i} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

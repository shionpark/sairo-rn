import { ScrollView, Text, View } from 'react-native';
import { Skeleton } from '@/components/Skeleton';
import type { Cf8ProfileCopy } from '@/data/cf8Profiles';
import ko from '../../../messages/ko.json';

const CARD = 'mx-gutter rounded-2xl bg-primary-tint px-6 py-4';

/** "이 목록은 이 기준으로 골랐다"를 선언하는 카드. 유형명과 3축 요약만 보여준다 */
export function TasteSummary({ copy }: { copy: Cf8ProfileCopy }) {
  const axes = [copy.atmosphere.title, copy.place.title, copy.rhythm.title];

  return (
    <View className={CARD}>
      <Text className="text-ds-caption font-semibold text-primary">{ko.feed.yourType}</Text>
      <Text className="text-ds-title-1 text-ink">{copy.profileName}</Text>

      {/* 한 줄로 고정하고 넘치면 옆으로 민다 — 접으면 카드 높이가 문구마다 달라진다 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3" contentContainerClassName="gap-2">
        {axes.map((axis) => (
          <Text
            key={axis}
            className="rounded-full border border-primary/30 px-3 py-1.5 text-ds-caption font-medium text-primary"
          >
            {axis}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

export function TasteSummarySkeleton() {
  return (
    <View className={CARD}>
      <Skeleton tone="tint" className="h-2.5 w-20" />
      <Skeleton tone="tint" className="mt-2.5 h-5 w-[70%]" />
      <View className="mt-3 flex-row gap-2">
        <Skeleton tone="tint" className="h-7 w-16 rounded-full" />
        <Skeleton tone="tint" className="h-7 w-24 rounded-full" />
        <Skeleton tone="tint" className="h-7 w-20 rounded-full" />
      </View>
    </View>
  );
}

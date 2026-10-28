import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useRecommendations } from '@/hooks/useRecommendations';

export default function Feed() {
  const { places, loading, error, retry } = useRecommendations();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
        <Text>추천을 불러오는 중</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center gap-3">
        <Text>추천 목록을 불러오지 못했어요</Text>
        <Pressable onPress={retry} className="rounded bg-black px-4 py-2">
          <Text className="text-white">다시 시도</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={places}
      keyExtractor={(p) => p.contentId}
      onRefresh={retry}
      refreshing={false}
      renderItem={({ item }) => (
        <Text className="px-4 py-2">
          {item.rank}. {item.title} {item.fitScore.toFixed(1)}
        </Text>
      )}
    />
  );
}

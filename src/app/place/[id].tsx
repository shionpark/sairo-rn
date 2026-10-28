import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** 상세 화면은 다음 티켓. 지금은 진입 · 복귀만 확인한다 */
export default function PlaceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-1 items-center justify-center bg-page">
      <Text className="text-ds-body-2 text-sub">장소 {id}</Text>
    </View>
  );
}

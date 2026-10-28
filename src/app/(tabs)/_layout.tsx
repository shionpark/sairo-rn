import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const icon = (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: ColorValue; size: number }) => <Ionicons name={name} color={color} size={size} />;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#101318' }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="feed" options={{ title: '추천', headerShown: false, tabBarIcon: icon('compass-outline') }} />
      <Tabs.Screen name="saved" options={{ title: '저장', tabBarIcon: icon('bookmark-outline') }} />
      <Tabs.Screen name="me" options={{ title: '내 정보', tabBarIcon: icon('person-outline') }} />
    </Tabs>
  );
}

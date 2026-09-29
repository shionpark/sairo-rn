import { Tabs } from 'expo-router';

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="feed" options={{ title: '추천' }} />
      <Tabs.Screen name="saved" options={{ title: '저장' }} />
      <Tabs.Screen name="me" options={{ title: '내 정보' }} />
    </Tabs>
  );
}

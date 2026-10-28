import '@/global.css';
import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { logEngineCheck } from '@/dev/engineCheck';

export default function RootLayout() {
  useEffect(logEngineCheck, []);
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="feed" options={{ title: '추천' }} />
      <Tabs.Screen name="saved" options={{ title: '저장' }} />
      <Tabs.Screen name="me" options={{ title: '내 정보' }} />
    </Tabs>
  );
}

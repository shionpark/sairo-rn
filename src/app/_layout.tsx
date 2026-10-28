import '@/global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { logEngineCheck, seedCf8Code } from '@/dev/engineCheck';

seedCf8Code();

export default function RootLayout() {
  useEffect(logEngineCheck, []);
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="place/[id]" options={{ title: '' }} />
    </Stack>
  );
}

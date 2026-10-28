import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const TONE = {
  /** 흰 바탕 위 */
  plain: 'bg-surface',
  /** 틴트 카드 안 — 회색을 쓰면 카드 밖에서 온 것처럼 뜬다 */
  tint: 'bg-primary/10',
} as const;

/** 로딩 자리를 잡는 회색 덩어리. 크기는 쓰는 쪽이 채워질 글의 실제 폭 · 높이로 정한다 */
export function Skeleton({ className, tone = 'plain' }: { className: string; tone?: keyof typeof TONE }) {
  const opacity = useRef(new Animated.Value(1)).current;

  // 웹 animate-pulse 와 같은 2초 주기
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return <Animated.View className={`rounded ${TONE[tone]} ${className}`} style={{ opacity }} />;
}

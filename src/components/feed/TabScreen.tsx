import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

/** 본문과 스켈레톤이 같은 골격을 그리도록 정적인 뼈대는 여기서만 정의한다 */
export function ScreenTitle({ children }: { children: ReactNode }) {
  return (
    <View className="px-gutter pt-3">
      <Text className="text-ds-display text-ink">{children}</Text>
    </View>
  );
}

/** 목록 바로 위 조건 줄. 왼쪽은 지금 상황(날씨), 오른쪽은 정렬 기준 */
export function ListHeader({ children, aside }: { children?: ReactNode; aside: string }) {
  return (
    <View className="mt-8 flex-row items-center justify-between gap-3 px-gutter">
      <View className="min-w-0 flex-1 flex-row items-center gap-1">{children}</View>
      <Text className="shrink-0 text-ds-caption font-semibold text-sub">{aside}</Text>
    </View>
  );
}

/** 액션은 이 자리에서 다시 시도한다 */
export function EmptyState({
  title,
  body,
  onAction,
  actionLabel,
}: {
  title: string;
  body: string;
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <View className="items-center gap-4 px-gutter py-12">
      <Text className="text-center text-ds-title-1 text-ink">{title}</Text>
      <Text className="max-w-[280px] text-center text-ds-body-2 text-sub">{body}</Text>
      {onAction && actionLabel && (
        <Text
          onPress={onAction}
          accessibilityRole="button"
          className="mt-2 min-h-12 overflow-hidden rounded-xl bg-primary px-6 py-3 text-ds-title-2 text-white active:bg-primary-press"
        >
          {actionLabel}
        </Text>
      )}
    </View>
  );
}

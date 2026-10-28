import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * 저장 토글. 색은 바탕이 정한다 — 사진 위는 흰색, 사진이 없는 밝은 자리는 먹색.
 * 저장/해제는 채움과 테두리로 가른다. 아이콘은 22px, 누르는 영역은 48px.
 */
export function SaveButton({
  saved,
  onToggle,
  placeName,
  onScrim = true,
  className,
}: {
  saved: boolean;
  onToggle: () => void;
  placeName: string;
  onScrim?: boolean;
  className?: string;
}) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      accessibilityLabel={saved ? `${placeName} 저장 해제` : `${placeName} 저장`}
      className={`size-12 items-center justify-center active:scale-90 ${className ?? ''}`}
    >
      <Ionicons
        name={saved ? 'bookmark' : 'bookmark-outline'}
        size={22}
        color={onScrim ? '#ffffff' : '#101318'}
        // 웹은 사진 위에 어두운 그라데이션을 깐다. RN 그라데이션은 네이티브 모듈이라 그림자로 대신한다
        style={onScrim ? { textShadowColor: 'rgba(0,0,0,0.45)', textShadowRadius: 2, textShadowOffset: { width: 0, height: 1 } } : undefined}
      />
    </Pressable>
  );
}

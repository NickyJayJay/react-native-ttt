import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { colors, timingConfigs } from '../../constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface ChalkSymbolProps {
  symbol: 'X' | 'O';
  size?: number;
  animated?: boolean;
}

// Hand-drawn style paths with slight wobble
const getXPaths = (size: number) => {
  const padding = size * 0.15;
  const start = padding;
  const end = size - padding;
  const mid = size / 2;
  const wobble = size * 0.05;

  return [
    `M ${start},${start} Q ${mid + wobble},${mid - wobble} ${end},${end}`,
    `M ${end},${start} Q ${mid - wobble},${mid + wobble} ${start},${end}`,
  ];
};

const getOPath = (size: number) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.35;
  const wobble = size * 0.03;

  return `M ${cx},${cy - r}
    C ${cx + r + wobble},${cy - r} ${cx + r},${cy + r - wobble} ${cx},${cy + r}
    C ${cx - r - wobble},${cy + r} ${cx - r},${cy - r + wobble} ${cx},${cy - r}`;
};

const X_PATH_LENGTH = 85;
const O_PATH_LENGTH = 200;

export function ChalkSymbol({ symbol, size = 64, animated = true }: ChalkSymbolProps) {
  const progress = useSharedValue(animated ? 0 : 1);

  useEffect(() => {
    if (animated) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: timingConfigs.draw,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [animated, progress]);

  // All hooks must be called unconditionally
  const animatedPropsX1 = useAnimatedProps(() => ({
    strokeDashoffset: X_PATH_LENGTH * (1 - progress.value),
  }));

  const animatedPropsX2 = useAnimatedProps(() => ({
    strokeDashoffset: X_PATH_LENGTH * (1 - Math.max(0, (progress.value - 0.3) / 0.7)),
  }));

  const animatedPropsO = useAnimatedProps(() => ({
    strokeDashoffset: O_PATH_LENGTH * (1 - progress.value),
  }));

  const color = symbol === 'X' ? colors.xColor : colors.oColor;
  const strokeWidth = size * 0.08;

  if (symbol === 'X') {
    const paths = getXPaths(size);

    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <AnimatedPath
            d={paths[0]}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={[X_PATH_LENGTH, X_PATH_LENGTH]}
            animatedProps={animatedPropsX1}
            fill="none"
          />
          <AnimatedPath
            d={paths[1]}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={[X_PATH_LENGTH, X_PATH_LENGTH]}
            animatedProps={animatedPropsX2}
            fill="none"
          />
        </Svg>
      </View>
    );
  }

  const oPath = getOPath(size);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <AnimatedPath
          d={oPath}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={[O_PATH_LENGTH, O_PATH_LENGTH]}
          animatedProps={animatedPropsO}
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

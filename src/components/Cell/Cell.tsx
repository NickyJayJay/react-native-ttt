import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { springConfigs, fontSize } from '../../constants/theme';
import { ChalkSymbol } from '../ChalkSymbol/ChalkSymbol';
import type { CellValue } from '../../types/game';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CellProps {
  value: CellValue;
  onPress: () => void;
  disabled: boolean;
  position: { row: number; col: number };
}

export function Cell({ value, onPress, disabled, position }: CellProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.85, springConfigs.bouncy);
      rotation.value = withSpring(-3, springConfigs.bouncy);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfigs.bouncy);
    rotation.value = withSpring(0, springConfigs.bouncy);
  };

  const cellIndex = position.row * 3 + position.col + 1;

  return (
    <AnimatedPressable
      style={[styles.cell, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Cell ${cellIndex}, ${value || 'empty'}`}
      accessibilityState={{ disabled }}
    >
      {value && (
        <ChalkSymbol symbol={value} size={fontSize.symbol} animated={true} />
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

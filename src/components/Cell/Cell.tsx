import React, { useEffect } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, fontSize } from '../../constants/theme';
import type { CellValue } from '../../types/game';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CellProps {
  value: CellValue;
  onPress: () => void;
  disabled: boolean;
  position: { row: number; col: number };
}

function getBorderStyles(position: { row: number; col: number }): ViewStyle {
  const { row, col } = position;
  return {
    borderRightWidth: col < 2 ? 2 : 0,
    borderBottomWidth: row < 2 ? 2 : 0,
  };
}

export function Cell({ value, onPress, disabled, position }: CellProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    if (value) {
      opacity.value = 0;
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [value, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const symbolAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const cellIndex = position.row * 3 + position.col + 1;

  return (
    <AnimatedPressable
      style={[styles.cell, getBorderStyles(position), animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Cell ${cellIndex}, ${value || 'empty'}`}
      accessibilityState={{ disabled }}
    >
      {value && (
        <Animated.View style={symbolAnimatedStyle}>
          <Text style={[styles.symbol, value === 'X' ? styles.x : styles.o]}>
            {value}
          </Text>
        </Animated.View>
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
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  symbol: {
    fontSize: fontSize.symbol,
    fontWeight: 'bold',
  },
  x: {
    color: colors.xColor,
  },
  o: {
    color: colors.oColor,
  },
});

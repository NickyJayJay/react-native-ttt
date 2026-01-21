import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.97);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const buttonStyles: ViewStyle[] = [styles.button, styles[`${variant}Button`]];
  const textStyles: TextStyle[] = [styles.text, styles[`${variant}Text`]];

  if (disabled) {
    buttonStyles.push(styles.disabledButton);
    textStyles.push(styles.disabledText);
  }

  return (
    <AnimatedPressable
      style={[buttonStyles, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={textStyles}>{title}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  primaryText: {
    color: colors.surface,
  },
  secondaryText: {
    color: colors.surface,
  },
  outlineText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.textLight,
  },
});

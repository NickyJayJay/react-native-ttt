import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { colors, spacing, fontSize, borderRadius, fonts, springConfigs } from '../../constants/theme';

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
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.92, springConfigs.bouncy);
      rotation.value = withSpring(Math.random() > 0.5 ? 2 : -2, springConfigs.bouncy);
    }
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.05, springConfigs.quick),
      withSpring(1, springConfigs.bouncy)
    );
    rotation.value = withSpring(0, springConfigs.bouncy);
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
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 300,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  primaryButton: {
    backgroundColor: 'transparent',
    borderColor: colors.chalkWhite,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: colors.textLight,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: colors.chalkWhite,
    borderStyle: 'solid',
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: fontSize.lg + 2,
    fontFamily: fonts.chalk,
  },
  primaryText: {
    color: colors.chalkWhite,
  },
  secondaryText: {
    color: colors.textLight,
  },
  outlineText: {
    color: colors.chalkWhite,
  },
  disabledText: {
    color: colors.textLight,
  },
});

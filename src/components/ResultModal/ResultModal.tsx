import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';
import { Button } from '../Button/Button';
import { colors, spacing, fontSize, borderRadius, fonts, springConfigs } from '../../constants/theme';
import type { GameResult } from '../../types/game';

interface ResultModalProps {
  visible: boolean;
  result: GameResult;
  onPlayAgain: (humanGoesFirst: boolean) => void;
}

function getMessage(result: GameResult): string {
  switch (result) {
    case 'win':
      return 'You Won!';
    case 'lose':
      return 'You Lost!';
    case 'tie':
      return "It's a Tie!";
    default:
      return '';
  }
}

function getMessageColor(result: GameResult): string {
  switch (result) {
    case 'win':
      return colors.success;
    case 'lose':
      return colors.error;
    case 'tie':
      return colors.text;
    default:
      return colors.text;
  }
}

export function ResultModal({ visible, result, onPlayAgain }: ResultModalProps) {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Reset values
      translateX.value = 0;
      rotation.value = 0;

      // Animate in with wobbly spring
      scale.value = withSpring(1, springConfigs.wobbly);
      opacity.value = withTiming(1, { duration: 200 });

      // Result-specific animations
      if (result === 'lose') {
        // Shake animation for lose
        translateX.value = withSequence(
          withTiming(-12, { duration: 50 }),
          withTiming(12, { duration: 100 }),
          withTiming(-12, { duration: 100 }),
          withTiming(12, { duration: 100 }),
          withTiming(-6, { duration: 75 }),
          withTiming(6, { duration: 75 }),
          withTiming(0, { duration: 50 })
        );
      } else if (result === 'tie') {
        // Wobble animation for tie
        rotation.value = withRepeat(
          withSequence(
            withTiming(3, { duration: 150 }),
            withTiming(-3, { duration: 300 }),
            withTiming(0, { duration: 150 })
          ),
          2,
          false
        );
      }
    } else {
      scale.value = 0.5;
      opacity.value = 0;
      translateX.value = 0;
      rotation.value = 0;
    }
  }, [visible, result, scale, opacity, translateX, rotation]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.6,
  }));

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.overlay, animatedOverlayStyle]} />
        <Animated.View style={[styles.content, animatedContainerStyle]}>
          <Text style={[styles.message, { color: getMessageColor(result) }]}>
            {getMessage(result)}
          </Text>
          <Text style={styles.subtitle}>Play again?</Text>
          <View style={styles.buttons}>
            <Button
              title="Go First"
              onPress={() => onPlayAgain(true)}
              variant="primary"
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="Go Second"
              onPress={() => onPlayAgain(false)}
              variant="secondary"
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 3,
    borderColor: colors.chalkWhite,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 280,
  },
  message: {
    fontSize: fontSize.xxl + 4,
    fontFamily: fonts.chalk,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.lg,
    fontFamily: fonts.chalk,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  buttons: {
    width: '100%',
  },
  buttonSpacer: {
    height: spacing.sm,
  },
});

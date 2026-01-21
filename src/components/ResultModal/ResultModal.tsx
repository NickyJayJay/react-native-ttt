import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Button } from '../Button/Button';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
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
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 15 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = 0.8;
      opacity.value = 0;
    }
  }, [visible, scale, opacity]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
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
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 280,
  },
  message: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
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

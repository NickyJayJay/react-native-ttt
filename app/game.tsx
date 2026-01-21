import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../src/hooks/useGame';
import { Board, ResultModal, Button } from '../src/components';
import { colors, spacing, fontSize } from '../src/constants/theme';

export default function GameScreen() {
  const { humanGoesFirst } = useLocalSearchParams<{ humanGoesFirst: string }>();

  const {
    board,
    humanPlayer,
    isGameOver,
    gameResult,
    isHumanTurn,
    makeMove,
    resetGame,
  } = useGame(humanGoesFirst === 'true');

  useEffect(() => {
    resetGame(humanGoesFirst === 'true');
  }, [humanGoesFirst, resetGame]);

  const handlePlayAgain = (goFirst: boolean) => {
    resetGame(goFirst);
  };

  const handleNewGame = () => {
    router.back();
  };

  const getStatusText = () => {
    if (isGameOver) {
      return 'Game Over';
    }
    if (isHumanTurn) {
      return `Your Turn (${humanPlayer})`;
    }
    return 'Computer is thinking...';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Tic Tac Toe</Text>
          <Text style={styles.status}>{getStatusText()}</Text>
          <View style={styles.playerInfo}>
            <Text style={styles.playerText}>
              You: <Text style={humanPlayer === 'X' ? styles.xColor : styles.oColor}>{humanPlayer}</Text>
            </Text>
            <Text style={styles.playerText}>
              Computer: <Text style={humanPlayer === 'X' ? styles.oColor : styles.xColor}>{humanPlayer === 'X' ? 'O' : 'X'}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.boardContainer}>
          <Board
            board={board}
            onCellPress={makeMove}
            disabled={!isHumanTurn}
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="New Game"
            onPress={handleNewGame}
            variant="outline"
          />
        </View>

        <ResultModal
          visible={isGameOver}
          result={gameResult}
          onPlayAgain={handlePlayAgain}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  status: {
    fontSize: fontSize.lg,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  playerInfo: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  playerText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  xColor: {
    color: colors.xColor,
    fontWeight: 'bold',
  },
  oColor: {
    color: colors.oColor,
    fontWeight: 'bold',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    marginTop: spacing.lg,
  },
});

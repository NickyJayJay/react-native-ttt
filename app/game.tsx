import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../src/hooks/useGame';
import { Board, ResultModal, Button } from '../src/components';
import { colors, spacing, fontSize, fonts } from '../src/constants/theme';

export default function GameScreen() {
  const { humanGoesFirst } = useLocalSearchParams<{ humanGoesFirst: string; }>();

  const {
    board,
    humanPlayer,
    isGameOver,
    gameResult,
    isHumanTurn,
    makeMove,
    resetGame,
    gameHistory
  } = useGame(humanGoesFirst === 'true');

  console.log('gameHistory', gameHistory);

  useEffect(() => {
    resetGame(humanGoesFirst === 'true');
  }, [humanGoesFirst, resetGame]);

  const handlePlayAgain = (goFirst: boolean) => {
    resetGame(goFirst);
  };

  const handleNewGame = () => {
    router.replace('/');
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

        <View>
          {/* <Text>
            {JSON.stringify(gameHistory)}
          </Text> */}
          {gameHistory.map((history) => (
            <View style={styles.history}>
              <Text style={styles.historyText}>{history.gameResult}</Text>
              <Text style={styles.historyText}>{new Date(history.timeStamp).toLocaleTimeString()}</Text>
              <Text style={styles.historyText}>{history.winner}</Text>
            </View>
          ))}
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
  history: {
    flexDirection: 'row',
    gap: spacing.lg
  },
  historyText: {
    fontSize: fontSize.lg,
    fontFamily: fonts.chalk,
    color: colors.textLight,
  },
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
    fontSize: fontSize.xxl + 16,
    fontFamily: fonts.chalk,
    color: colors.chalkWhite,
    marginBottom: spacing.xs,
  },
  status: {
    fontSize: fontSize.xl,
    fontFamily: fonts.chalk,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  playerInfo: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  playerText: {
    fontSize: fontSize.lg,
    fontFamily: fonts.chalk,
    color: colors.text,
  },
  xColor: {
    color: colors.xColor,
  },
  oColor: {
    color: colors.oColor,
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    marginTop: spacing.lg,
  },
});

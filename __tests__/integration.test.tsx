/**
 * Integration tests for the Tic Tac Toe game.
 *
 * These tests render actual React components and verify the visual state
 * before, during, and after game completion under various scenarios.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react-native';
import { useGame } from '../src/hooks/useGame';
import { Board, ResultModal } from '../src/components';
import { getBestMove } from '../src/utils/minimax';
import type { Board as BoardType, Player } from '../src/types/game';

const COMPUTER_MOVE_DELAY = 500;

interface TestGameProps {
  humanGoesFirst: boolean;
}

function TestGame({ humanGoesFirst }: TestGameProps) {
  const {
    board,
    humanPlayer,
    isGameOver,
    gameResult,
    isHumanTurn,
    makeMove,
    resetGame,
  } = useGame(humanGoesFirst);

  const getStatusText = () => {
    if (isGameOver) return 'Game Over';
    if (isHumanTurn) return 'Your Turn (' + humanPlayer + ')';
    return 'Computer is thinking...';
  };

  return (
    <View>
      <Text testID="status">{getStatusText()}</Text>
      <Text testID="human-player">You: {humanPlayer}</Text>
      <Board board={board} onCellPress={makeMove} disabled={!isHumanTurn} />
      <ResultModal
        visible={isGameOver}
        result={gameResult}
        onPlayAgain={resetGame}
      />
    </View>
  );
}

function getCellLabel(index: number, value: string): string {
  return 'Cell ' + index + ', ' + value;
}

/**
 * Reads the current board state from the rendered cells using accessibility labels.
 * Cell indices in the UI are 1-based, but board array is 0-based.
 */
function getBoardStateFromScreen(): BoardType {
  const board: BoardType = [null, null, null, null, null, null, null, null, null];
  for (let i = 0; i < 9; i++) {
    const cellIndex = i + 1; // UI uses 1-based indexing
    const xCell = screen.queryByLabelText(getCellLabel(cellIndex, 'X'));
    const oCell = screen.queryByLabelText(getCellLabel(cellIndex, 'O'));
    if (xCell) {
      board[i] = 'X';
    } else if (oCell) {
      board[i] = 'O';
    }
  }
  return board;
}

/**
 * Gets the optimal move for the human player using minimax.
 */
function getOptimalHumanMove(humanPlayer: Player, computerPlayer: Player): number {
  const board = getBoardStateFromScreen();
  // Call getBestMove from human's perspective (swap players)
  return getBestMove(board, humanPlayer, computerPlayer);
}

describe('Game Integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('should render empty board when human goes first', () => {
      render(<TestGame humanGoesFirst={true} />);

      // All 9 cells should be empty
      for (let i = 1; i <= 9; i++) {
        expect(screen.getByLabelText(getCellLabel(i, 'empty'))).toBeTruthy();
      }

      expect(screen.getByTestId('status')).toHaveTextContent('Your Turn (X)');
      expect(screen.getByTestId('human-player')).toHaveTextContent('You: X');
    });

    it('should show computer thinking when computer goes first', async () => {
      render(<TestGame humanGoesFirst={false} />);

      expect(screen.getByTestId('status')).toHaveTextContent('Computer is thinking...');
      expect(screen.getByTestId('human-player')).toHaveTextContent('You: O');

      // Computer should make first move after delay
      await act(async () => {
        jest.advanceTimersByTime(COMPUTER_MOVE_DELAY);
      });

      // Now it should be human's turn and one cell should have X
      expect(screen.getByTestId('status')).toHaveTextContent('Your Turn (O)');
      const xCells = screen.queryAllByLabelText(/Cell \d, X/);
      expect(xCells).toHaveLength(1);
    });
  });

  describe('gameplay - human turn', () => {
    it('should place human marker when cell is pressed', async () => {
      render(<TestGame humanGoesFirst={true} />);

      // Human plays center (cell 5)
      fireEvent.press(screen.getByLabelText('Cell 5, empty'));

      // Cell should now show X
      expect(screen.getByLabelText('Cell 5, X')).toBeTruthy();

      // Status should show computer thinking
      expect(screen.getByTestId('status')).toHaveTextContent('Computer is thinking...');
    });

    it('should not allow pressing occupied cells', async () => {
      render(<TestGame humanGoesFirst={true} />);

      // Human plays center
      fireEvent.press(screen.getByLabelText('Cell 5, empty'));
      expect(screen.getByLabelText('Cell 5, X')).toBeTruthy();

      // Wait for computer move
      await act(async () => {
        jest.advanceTimersByTime(COMPUTER_MOVE_DELAY);
      });

      // Try to press the same cell - should still be X (not change)
      fireEvent.press(screen.getByLabelText('Cell 5, X'));
      expect(screen.getByLabelText('Cell 5, X')).toBeTruthy();
    });

    it('should not allow moves when it is computer turn', async () => {
      render(<TestGame humanGoesFirst={true} />);

      // Human plays center
      fireEvent.press(screen.getByLabelText('Cell 5, empty'));

      // While computer is thinking, try to play another cell
      const cell1 = screen.getByLabelText('Cell 1, empty');
      fireEvent.press(cell1);

      // Cell 1 should still be empty (move rejected)
      expect(screen.getByLabelText('Cell 1, empty')).toBeTruthy();
    });
  });

  describe('gameplay - computer response', () => {
    it('should make computer move after delay', async () => {
      render(<TestGame humanGoesFirst={true} />);

      // Human plays center
      fireEvent.press(screen.getByLabelText('Cell 5, empty'));

      // Before delay, only one X on board
      let xCells = screen.queryAllByLabelText(/Cell \d, X/);
      expect(xCells).toHaveLength(1);
      let oCells = screen.queryAllByLabelText(/Cell \d, O/);
      expect(oCells).toHaveLength(0);

      // Advance time for computer move
      await act(async () => {
        jest.advanceTimersByTime(COMPUTER_MOVE_DELAY);
      });

      // Now should have one O on board
      oCells = screen.queryAllByLabelText(/Cell \d, O/);
      expect(oCells).toHaveLength(1);

      // Should be human's turn again
      expect(screen.getByTestId('status')).toHaveTextContent('Your Turn (X)');
    });
  });

  describe('complete game - computer wins', () => {
    it('should show lose modal when computer wins', async () => {
      render(<TestGame humanGoesFirst={true} />);

      // Play a game where human makes bad moves and computer wins
      // Human plays edge (bad opening)
      fireEvent.press(screen.getByLabelText('Cell 2, empty'));

      await act(async () => {
        jest.advanceTimersByTime(COMPUTER_MOVE_DELAY);
      });

      // Human plays another bad move
      const emptyCells = screen.queryAllByLabelText(/Cell \d, empty/);
      if (emptyCells.length > 0) {
        fireEvent.press(emptyCells[0]);
      }

      await act(async () => {
        jest.advanceTimersByTime(COMPUTER_MOVE_DELAY);
      });

      // Continue until game ends
      let gameOver = false;
      let iterations = 0;
      while (!gameOver && iterations < 10) {
        const status = screen.getByTestId('status');
        if (status.props.children === 'Game Over') {
          gameOver = true;
        } else if (status.props.children.includes('Your Turn')) {
          const remaining = screen.queryAllByLabelText(/Cell \d, empty/);
          if (remaining.length > 0) {
            fireEvent.press(remaining[0]);
          }
        }
        await act(async () => {
          jest.advanceTimersByTime(COMPUTER_MOVE_DELAY);
        });
        iterations++;
      }

      // Game should be over
      expect(screen.getByTestId('status')).toHaveTextContent('Game Over');

      // Result modal should show (either lose or tie - computer never loses)
      await waitFor(() => {
        const lostText = screen.queryByText('You Lost!');
        const tieText = screen.queryByText("It's a Tie!");
        expect(lostText || tieText).toBeTruthy();
      });
    });
  });

  describe('complete game - tie', () => {
    it('should show tie modal when game ends in draw', async () => {
      render(<TestGame humanGoesFirst={true} />);

      // Both players use minimax for optimal play - guaranteed tie
      const humanPlayer: Player = 'X';
      const computerPlayer: Player = 'O';

      // Play until game ends, using minimax for human moves
      let iterations = 0;
      while (iterations < 10) {
        const status = screen.getByTestId('status');
        if (status.props.children === 'Game Over') {
          break;
        }
        if (status.props.children.includes('Your Turn')) {
          // Use minimax to find the optimal human move
          const optimalMove = getOptimalHumanMove(humanPlayer, computerPlayer);
          const cellIndex = optimalMove + 1; // Convert to 1-based UI index
          const cell = screen.getByLabelText(getCellLabel(cellIndex, 'empty'));
          fireEvent.press(cell);
        }
        await act(async () => {
          jest.advanceTimersByTime(COMPUTER_MOVE_DELAY);
        });
        iterations++;
      }

      // With both sides playing optimally, the game must end in a tie
      expect(screen.getByTestId('status')).toHaveTextContent('Game Over');
      expect(screen.getByText("It's a Tie!")).toBeTruthy();

      // Should never see win or lose when both play optimally
      expect(screen.queryByText('You Won!')).toBeNull();
      expect(screen.queryByText('You Lost!')).toBeNull();
    });
  });

  describe('play again functionality', () => {
    it('should reset game when "Go First" is pressed after game over', async () => {
      render(<TestGame humanGoesFirst={true} />);

      // Play through a quick game
      fireEvent.press(screen.getByLabelText('Cell 2, empty'));

      // Play until game over
      let iterations = 0;
      while (iterations < 10) {
        await act(async () => {
          jest.advanceTimersByTime(COMPUTER_MOVE_DELAY);
        });
        const status = screen.getByTestId('status');
        if (status.props.children === 'Game Over') break;
        if (status.props.children.includes('Your Turn')) {
          const remaining = screen.queryAllByLabelText(/Cell \d, empty/);
          if (remaining.length > 0) fireEvent.press(remaining[0]);
        }
        iterations++;
      }

      // Press "Go First" button
      await waitFor(() => {
        expect(screen.getByText('Go First')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('Go First'));

      // Board should be reset - all cells empty
      await waitFor(() => {
        expect(screen.getByLabelText('Cell 5, empty')).toBeTruthy();
      });

      // All cells should be empty
      for (let i = 1; i <= 9; i++) {
        expect(screen.getByLabelText(getCellLabel(i, 'empty'))).toBeTruthy();
      }

      // Should be human's turn as X
      expect(screen.getByTestId('status')).toHaveTextContent('Your Turn (X)');
    });

    it('should let computer go first when "Go Second" is pressed', async () => {
      render(<TestGame humanGoesFirst={true} />);

      // Play a quick game
      fireEvent.press(screen.getByLabelText('Cell 2, empty'));

      let iterations = 0;
      while (iterations < 10) {
        await act(async () => {
          jest.advanceTimersByTime(COMPUTER_MOVE_DELAY);
        });
        const status = screen.getByTestId('status');
        if (status.props.children === 'Game Over') break;
        if (status.props.children.includes('Your Turn')) {
          const remaining = screen.queryAllByLabelText(/Cell \d, empty/);
          if (remaining.length > 0) fireEvent.press(remaining[0]);
        }
        iterations++;
      }

      // Press "Go Second" button
      await waitFor(() => {
        expect(screen.getByText('Go Second')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('Go Second'));

      // Should show computer thinking
      await waitFor(() => {
        expect(screen.getByTestId('status')).toHaveTextContent('Computer is thinking...');
      });

      // Human should now be O
      expect(screen.getByTestId('human-player')).toHaveTextContent('You: O');
    });
  });

  describe('cell visual states', () => {
    it('should show correct markers for both players throughout game', async () => {
      render(<TestGame humanGoesFirst={true} />);

      // Human (X) plays center
      fireEvent.press(screen.getByLabelText('Cell 5, empty'));
      expect(screen.getByLabelText('Cell 5, X')).toBeTruthy();

      // Wait for computer (O)
      await act(async () => {
        jest.advanceTimersByTime(COMPUTER_MOVE_DELAY);
      });

      // Should have exactly one X and one O
      const xCells = screen.queryAllByLabelText(/Cell \d, X/);
      const oCells = screen.queryAllByLabelText(/Cell \d, O/);
      expect(xCells).toHaveLength(1);
      expect(oCells).toHaveLength(1);

      // Human plays again
      const emptyCells = screen.queryAllByLabelText(/Cell \d, empty/);
      fireEvent.press(emptyCells[0]);

      // Should now have 2 X and 1 O
      expect(screen.queryAllByLabelText(/Cell \d, X/)).toHaveLength(2);
      expect(screen.queryAllByLabelText(/Cell \d, O/)).toHaveLength(1);
    });
  });

});

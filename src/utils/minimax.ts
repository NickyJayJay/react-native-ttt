import { Board, Player } from '../types/game';
import { checkWinner, isBoardFull, getEmptyCells } from './gameLogic';

interface MinimaxResult {
  score: number;
  index: number;
}

/**
 * Minimax algorithm for finding the optimal move.
 *
 * The algorithm recursively explores all possible game states and assigns scores:
 * - Computer wins: +10 (adjusted by depth to prefer faster wins)
 * - Human wins: -10 (adjusted by depth to prefer slower losses)
 * - Tie: 0
 *
 * On the computer's turn (maximizing), it picks the move with the highest score.
 * On the human's turn (minimizing), it assumes the human picks the lowest score.
 *
 * @param board - Current board state
 * @param depth - Current depth in the game tree (for score adjustment)
 * @param isMaximizing - true if it's the computer's turn
 * @param computerPlayer - The computer's symbol ('X' or 'O')
 * @param humanPlayer - The human's symbol ('X' or 'O')
 * @returns Object containing the best score and move index
 */
function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  computerPlayer: Player,
  humanPlayer: Player
): MinimaxResult {
  const winner = checkWinner(board);

  // Terminal states
  if (winner === computerPlayer) {
    return { score: 10 - depth, index: -1 };
  }
  if (winner === humanPlayer) {
    return { score: depth - 10, index: -1 };
  }
  if (isBoardFull(board)) {
    return { score: 0, index: -1 };
  }

  const availableMoves = getEmptyCells(board);

  if (isMaximizing) {
    // Computer's turn - maximize score
    let best: MinimaxResult = { score: -Infinity, index: availableMoves[0] };

    for (const move of availableMoves) {
      // Make the move
      const newBoard = [...board];
      newBoard[move] = computerPlayer;

      // Recursively evaluate
      const result = minimax(newBoard, depth + 1, false, computerPlayer, humanPlayer);

      if (result.score > best.score) {
        best = { score: result.score, index: move };
      }
    }

    return best;
  } else {
    // Human's turn - minimize score (assume human plays optimally)
    let best: MinimaxResult = { score: Infinity, index: availableMoves[0] };

    for (const move of availableMoves) {
      // Make the move
      const newBoard = [...board];
      newBoard[move] = humanPlayer;

      // Recursively evaluate
      const result = minimax(newBoard, depth + 1, true, computerPlayer, humanPlayer);

      if (result.score < best.score) {
        best = { score: result.score, index: move };
      }
    }

    return best;
  }
}

/**
 * Get the best move for the computer player using the Minimax algorithm.
 *
 * This function is guaranteed to return a move that either:
 * 1. Wins the game if possible
 * 2. Blocks the opponent from winning
 * 3. Makes the optimal strategic move
 *
 * The computer can never lose if this algorithm is used - it will either
 * win or force a tie.
 *
 * @param board - Current board state
 * @param computerPlayer - The computer's symbol ('X' or 'O')
 * @param humanPlayer - The human's symbol ('X' or 'O')
 * @returns The index of the best move (0-8)
 */
export function getBestMove(board: Board, computerPlayer: Player, humanPlayer: Player): number {
  const result = minimax(board, 0, true, computerPlayer, humanPlayer);
  return result.index;
}

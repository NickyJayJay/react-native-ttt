import { Board, CellValue, Player } from '../types/game';

/**
 * All possible winning combinations on a 3x3 board.
 * Each array contains the indices of three cells that form a winning line.
 */
export const WINNING_COMBINATIONS: readonly number[][] = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal: top-left to bottom-right
  [2, 4, 6], // Diagonal: top-right to bottom-left
];

/**
 * Check if there's a winner on the board.
 * @param board - The current board state
 * @returns The winning player ('X' or 'O') or null if no winner
 */
export function checkWinner(board: Board): Player | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }
  return null;
}

/**
 * Check if the board is completely filled.
 * @param board - The current board state
 * @returns true if all cells are occupied
 */
export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

/**
 * Get indices of all empty cells on the board.
 * @param board - The current board state
 * @returns Array of indices where cells are empty
 */
export function getEmptyCells(board: Board): number[] {
  return board.reduce<number[]>((cells, cell, index) => {
    if (cell === null) {
      cells.push(index);
    }
    return cells;
  }, []);
}

/**
 * Create a new empty board.
 * @returns A board with all cells set to null
 */
export function createEmptyBoard(): Board {
  return Array(9).fill(null) as CellValue[];
}

/**
 * Check if a move is valid.
 * @param board - The current board state
 * @param index - The cell index to check
 * @returns true if the move is valid (cell is empty and in bounds)
 */
export function isValidMove(board: Board, index: number): boolean {
  return index >= 0 && index < 9 && board[index] === null;
}

/**
 * Make a move on the board.
 * @param board - The current board state
 * @param index - The cell index to place the mark
 * @param player - The player making the move
 * @returns A new board with the move applied, or the original board if invalid
 */
export function makeMove(board: Board, index: number, player: Player): Board {
  if (!isValidMove(board, index)) {
    return board;
  }
  const newBoard = [...board];
  newBoard[index] = player;
  return newBoard;
}

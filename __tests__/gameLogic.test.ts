import {
  checkWinner,
  isBoardFull,
  getEmptyCells,
  createEmptyBoard,
  isValidMove,
  makeMove,
  WINNING_COMBINATIONS,
} from '../src/utils/gameLogic';
import { Board } from '../src/types/game';

describe('gameLogic', () => {
  describe('WINNING_COMBINATIONS', () => {
    it('should have 8 winning combinations', () => {
      expect(WINNING_COMBINATIONS).toHaveLength(8);
    });

    it('should have 3 indices per combination', () => {
      WINNING_COMBINATIONS.forEach((combo) => {
        expect(combo).toHaveLength(3);
      });
    });
  });

  describe('checkWinner', () => {
    it('should return null for empty board', () => {
      const board = createEmptyBoard();
      expect(checkWinner(board)).toBeNull();
    });

    it('should detect X winning in top row', () => {
      const board: Board = ['X', 'X', 'X', null, 'O', 'O', null, null, null];
      expect(checkWinner(board)).toBe('X');
    });

    it('should detect O winning in middle row', () => {
      const board: Board = ['X', null, 'X', 'O', 'O', 'O', null, 'X', null];
      expect(checkWinner(board)).toBe('O');
    });

    it('should detect X winning in bottom row', () => {
      const board: Board = ['O', 'O', null, null, null, null, 'X', 'X', 'X'];
      expect(checkWinner(board)).toBe('X');
    });

    it('should detect O winning in left column', () => {
      const board: Board = ['O', 'X', 'X', 'O', null, null, 'O', null, null];
      expect(checkWinner(board)).toBe('O');
    });

    it('should detect X winning in middle column', () => {
      const board: Board = ['O', 'X', null, null, 'X', 'O', null, 'X', null];
      expect(checkWinner(board)).toBe('X');
    });

    it('should detect O winning in right column', () => {
      const board: Board = ['X', null, 'O', 'X', null, 'O', null, null, 'O'];
      expect(checkWinner(board)).toBe('O');
    });

    it('should detect X winning in diagonal (top-left to bottom-right)', () => {
      const board: Board = ['X', 'O', 'O', null, 'X', null, null, null, 'X'];
      expect(checkWinner(board)).toBe('X');
    });

    it('should detect O winning in diagonal (top-right to bottom-left)', () => {
      const board: Board = ['X', null, 'O', 'X', 'O', null, 'O', null, null];
      expect(checkWinner(board)).toBe('O');
    });

    it('should return null for a tie game', () => {
      const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      expect(checkWinner(board)).toBeNull();
    });

    it('should return null for incomplete game with no winner', () => {
      const board: Board = ['X', 'O', null, null, 'X', null, null, null, null];
      expect(checkWinner(board)).toBeNull();
    });
  });

  describe('isBoardFull', () => {
    it('should return false for empty board', () => {
      const board = createEmptyBoard();
      expect(isBoardFull(board)).toBe(false);
    });

    it('should return false for partially filled board', () => {
      const board: Board = ['X', 'O', null, null, 'X', null, null, null, null];
      expect(isBoardFull(board)).toBe(false);
    });

    it('should return true for completely filled board', () => {
      const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      expect(isBoardFull(board)).toBe(true);
    });

    it('should return false if only one cell is empty', () => {
      const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
      expect(isBoardFull(board)).toBe(false);
    });
  });

  describe('getEmptyCells', () => {
    it('should return all indices for empty board', () => {
      const board = createEmptyBoard();
      expect(getEmptyCells(board)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should return empty array for full board', () => {
      const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      expect(getEmptyCells(board)).toEqual([]);
    });

    it('should return correct indices for partially filled board', () => {
      const board: Board = ['X', null, 'O', null, 'X', null, null, 'O', null];
      expect(getEmptyCells(board)).toEqual([1, 3, 5, 6, 8]);
    });
  });

  describe('createEmptyBoard', () => {
    it('should create a board with 9 cells', () => {
      const board = createEmptyBoard();
      expect(board).toHaveLength(9);
    });

    it('should create a board with all null values', () => {
      const board = createEmptyBoard();
      board.forEach((cell) => {
        expect(cell).toBeNull();
      });
    });
  });

  describe('isValidMove', () => {
    it('should return true for empty cell within bounds', () => {
      const board = createEmptyBoard();
      expect(isValidMove(board, 0)).toBe(true);
      expect(isValidMove(board, 4)).toBe(true);
      expect(isValidMove(board, 8)).toBe(true);
    });

    it('should return false for occupied cell', () => {
      const board: Board = ['X', null, null, null, null, null, null, null, null];
      expect(isValidMove(board, 0)).toBe(false);
    });

    it('should return false for negative index', () => {
      const board = createEmptyBoard();
      expect(isValidMove(board, -1)).toBe(false);
    });

    it('should return false for index >= 9', () => {
      const board = createEmptyBoard();
      expect(isValidMove(board, 9)).toBe(false);
      expect(isValidMove(board, 100)).toBe(false);
    });
  });

  describe('makeMove', () => {
    it('should place X in empty cell', () => {
      const board = createEmptyBoard();
      const newBoard = makeMove(board, 4, 'X');
      expect(newBoard[4]).toBe('X');
    });

    it('should place O in empty cell', () => {
      const board = createEmptyBoard();
      const newBoard = makeMove(board, 0, 'O');
      expect(newBoard[0]).toBe('O');
    });

    it('should not modify the original board', () => {
      const board = createEmptyBoard();
      makeMove(board, 4, 'X');
      expect(board[4]).toBeNull();
    });

    it('should return the same board for invalid move (occupied cell)', () => {
      const board: Board = ['X', null, null, null, null, null, null, null, null];
      const newBoard = makeMove(board, 0, 'O');
      expect(newBoard).toBe(board);
    });

    it('should return the same board for invalid move (out of bounds)', () => {
      const board = createEmptyBoard();
      const newBoard = makeMove(board, -1, 'X');
      expect(newBoard).toBe(board);
    });
  });
});

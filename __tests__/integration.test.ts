/**
 * Integration test for the full Tic Tac Toe game flow.
 *
 * This test simulates a complete game session without rendering React components,
 * focusing on the game logic integration between the useGame hook behavior
 * and the minimax algorithm.
 */

import { getBestMove } from '../src/utils/minimax';
import {
  checkWinner,
  isBoardFull,
  createEmptyBoard,
  isValidMove,
} from '../src/utils/gameLogic';
import { Board, Player, GameResult } from '../src/types/game';

interface GameSession {
  board: Board;
  currentPlayer: Player;
  humanPlayer: Player;
  computerPlayer: Player;
  isGameOver: boolean;
  gameResult: GameResult;
}

function createGameSession(humanGoesFirst: boolean): GameSession {
  return {
    board: createEmptyBoard(),
    currentPlayer: 'X',
    humanPlayer: humanGoesFirst ? 'X' : 'O',
    computerPlayer: humanGoesFirst ? 'O' : 'X',
    isGameOver: false,
    gameResult: null,
  };
}

function makeMove(session: GameSession, index: number): GameSession {
  if (session.isGameOver || !isValidMove(session.board, index)) {
    return session;
  }

  const newBoard = [...session.board];
  newBoard[index] = session.currentPlayer;

  const winner = checkWinner(newBoard);
  const boardFull = isBoardFull(newBoard);
  const isGameOver = winner !== null || boardFull;

  let gameResult: GameResult = null;
  if (winner === session.humanPlayer) {
    gameResult = 'win';
  } else if (winner === session.computerPlayer) {
    gameResult = 'lose';
  } else if (boardFull) {
    gameResult = 'tie';
  }

  return {
    ...session,
    board: newBoard,
    currentPlayer: session.currentPlayer === 'X' ? 'O' : 'X',
    isGameOver,
    gameResult,
  };
}

function computerMove(session: GameSession): GameSession {
  if (session.isGameOver || session.currentPlayer !== session.computerPlayer) {
    return session;
  }

  const bestMove = getBestMove(
    session.board,
    session.computerPlayer,
    session.humanPlayer
  );

  return makeMove(session, bestMove);
}

describe('Game Integration', () => {
  describe('full game flow', () => {
    it('should complete a game where human goes first and computer responds', () => {
      let session = createGameSession(true);

      // Human moves to center
      session = makeMove(session, 4);
      expect(session.board[4]).toBe('X');
      expect(session.currentPlayer).toBe('O');
      expect(session.isGameOver).toBe(false);

      // Computer responds
      session = computerMove(session);
      const computerMoves = session.board.filter((cell) => cell === 'O');
      expect(computerMoves.length).toBe(1);
      expect(session.currentPlayer).toBe('X');
    });

    it('should complete a game where computer goes first', () => {
      let session = createGameSession(false);

      // Computer makes first move
      session = computerMove(session);
      const computerMoves = session.board.filter((cell) => cell === 'X');
      expect(computerMoves.length).toBe(1);
      expect(session.currentPlayer).toBe('O');

      // Human responds
      const emptyCell = session.board.findIndex((cell) => cell === null);
      session = makeMove(session, emptyCell);
      expect(session.board[emptyCell]).toBe('O');
    });

    it('should prevent human from moving on occupied cells', () => {
      let session = createGameSession(true);

      // Human moves to center
      session = makeMove(session, 4);
      expect(session.board[4]).toBe('X');

      // Try to move to the same cell again (should fail)
      const sessionAfterInvalidMove = makeMove(session, 4);
      expect(sessionAfterInvalidMove).toBe(session);
    });

    it('should detect game over when computer wins', () => {
      // Set up a board where computer (O) can win
      let session: GameSession = {
        board: ['O', 'O', null, 'X', 'X', null, null, null, null],
        currentPlayer: 'O',
        humanPlayer: 'X',
        computerPlayer: 'O',
        isGameOver: false,
        gameResult: null,
      };

      // Computer should take the winning move
      session = computerMove(session);
      expect(session.board[2]).toBe('O');
      expect(session.isGameOver).toBe(true);
      expect(session.gameResult).toBe('lose');
    });

    it('should detect tie when board is full with no winner', () => {
      // Set up a board that will result in a tie
      let session: GameSession = {
        board: ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null],
        currentPlayer: 'X',
        humanPlayer: 'X',
        computerPlayer: 'O',
        isGameOver: false,
        gameResult: null,
      };

      // Human makes the last move
      session = makeMove(session, 8);
      expect(session.isGameOver).toBe(true);
      expect(session.gameResult).toBe('tie');
    });
  });

  describe('computer never loses simulation', () => {
    function playFullGame(humanGoesFirst: boolean): GameResult {
      let session = createGameSession(humanGoesFirst);

      while (!session.isGameOver) {
        if (session.currentPlayer === session.computerPlayer) {
          session = computerMove(session);
        } else {
          // Human makes a random move
          const emptyCells = session.board
            .map((cell, i) => (cell === null ? i : -1))
            .filter((i) => i !== -1);
          const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          session = makeMove(session, randomMove);
        }
      }

      return session.gameResult;
    }

    it('should never let human win in 50 games where human goes first', () => {
      for (let i = 0; i < 50; i++) {
        const result = playFullGame(true);
        expect(result).not.toBe('win');
      }
    });

    it('should never let human win in 50 games where computer goes first', () => {
      for (let i = 0; i < 50; i++) {
        const result = playFullGame(false);
        expect(result).not.toBe('win');
      }
    });
  });

  describe('game reset', () => {
    it('should reset to initial state when human goes first', () => {
      const session = createGameSession(true);
      expect(session.board.every((cell) => cell === null)).toBe(true);
      expect(session.humanPlayer).toBe('X');
      expect(session.computerPlayer).toBe('O');
      expect(session.currentPlayer).toBe('X');
      expect(session.isGameOver).toBe(false);
      expect(session.gameResult).toBeNull();
    });

    it('should reset to initial state when computer goes first', () => {
      const session = createGameSession(false);
      expect(session.board.every((cell) => cell === null)).toBe(true);
      expect(session.humanPlayer).toBe('O');
      expect(session.computerPlayer).toBe('X');
      expect(session.currentPlayer).toBe('X');
      expect(session.isGameOver).toBe(false);
      expect(session.gameResult).toBeNull();
    });
  });
});

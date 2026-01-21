import { getBestMove } from '../src/utils/minimax';
import { checkWinner, isBoardFull, getEmptyCells, createEmptyBoard } from '../src/utils/gameLogic';
import { Board, Player } from '../src/types/game';

describe('minimax', () => {
  describe('getBestMove', () => {
    describe('winning moves', () => {
      it('should take winning move in top row', () => {
        const board: Board = ['O', 'O', null, 'X', 'X', null, null, null, null];
        const move = getBestMove(board, 'O', 'X');
        expect(move).toBe(2);
      });

      it('should take winning move in middle row', () => {
        const board: Board = ['X', null, null, 'O', null, 'O', 'X', null, null];
        const move = getBestMove(board, 'O', 'X');
        expect(move).toBe(4);
      });

      it('should take winning move in bottom row', () => {
        const board: Board = ['X', 'X', null, null, null, null, 'O', 'O', null];
        const move = getBestMove(board, 'O', 'X');
        expect(move).toBe(8);
      });

      it('should take winning move in left column', () => {
        const board: Board = ['O', 'X', null, 'O', 'X', null, null, null, null];
        const move = getBestMove(board, 'O', 'X');
        expect(move).toBe(6);
      });

      it('should take winning move in diagonal', () => {
        const board: Board = ['O', 'X', null, 'X', 'O', null, null, null, null];
        const move = getBestMove(board, 'O', 'X');
        expect(move).toBe(8);
      });
    });

    describe('blocking moves', () => {
      it('should block opponent winning in top row', () => {
        const board: Board = ['X', 'X', null, 'O', null, null, null, null, null];
        const move = getBestMove(board, 'O', 'X');
        expect(move).toBe(2);
      });

      it('should block opponent winning in middle column', () => {
        const board: Board = [null, 'X', null, 'O', 'X', null, null, null, null];
        const move = getBestMove(board, 'O', 'X');
        expect(move).toBe(7);
      });

      it('should block opponent winning in diagonal', () => {
        const board: Board = ['X', null, 'O', null, 'X', null, null, null, null];
        const move = getBestMove(board, 'O', 'X');
        expect(move).toBe(8);
      });
    });

    describe('optimal opening moves', () => {
      it('should take center or corner on empty board', () => {
        const board = createEmptyBoard();
        const move = getBestMove(board, 'O', 'X');
        // Center (4) or any corner (0, 2, 6, 8) are all optimal first moves
        expect([0, 2, 4, 6, 8]).toContain(move);
      });

      it('should take corner when center is taken', () => {
        const board: Board = [null, null, null, null, 'X', null, null, null, null];
        const move = getBestMove(board, 'O', 'X');
        // Any corner is optimal
        expect([0, 2, 6, 8]).toContain(move);
      });

      it('should take center when corner is taken', () => {
        const board: Board = ['X', null, null, null, null, null, null, null, null];
        const move = getBestMove(board, 'O', 'X');
        expect(move).toBe(4);
      });
    });

    describe('prioritization', () => {
      it('should prefer winning over blocking', () => {
        // O can win at position 2, or block X win at position 6
        const board: Board = ['O', 'O', null, 'X', 'X', null, null, null, null];
        const move = getBestMove(board, 'O', 'X');
        expect(move).toBe(2); // Win, not block
      });
    });
  });

  describe('unbeatable AI simulation', () => {
    /**
     * Simulates a game where the human makes random moves.
     * Returns 'computer_wins', 'human_wins', or 'tie'.
     */
    function simulateGame(computerGoesFirst: boolean): 'computer_wins' | 'human_wins' | 'tie' {
      let board = createEmptyBoard();
      const computerPlayer: Player = computerGoesFirst ? 'X' : 'O';
      const humanPlayer: Player = computerGoesFirst ? 'O' : 'X';
      let isComputerTurn = computerGoesFirst;

      while (!checkWinner(board) && !isBoardFull(board)) {
        if (isComputerTurn) {
          const move = getBestMove(board, computerPlayer, humanPlayer);
          board = [...board];
          board[move] = computerPlayer;
        } else {
          // Human makes a random move
          const emptyCells = getEmptyCells(board);
          const randomIndex = Math.floor(Math.random() * emptyCells.length);
          const move = emptyCells[randomIndex];
          board = [...board];
          board[move] = humanPlayer;
        }
        isComputerTurn = !isComputerTurn;
      }

      const winner = checkWinner(board);
      if (winner === computerPlayer) return 'computer_wins';
      if (winner === humanPlayer) return 'human_wins';
      return 'tie';
    }

    it('should never lose when computer goes first (100 games)', () => {
      for (let i = 0; i < 100; i++) {
        const result = simulateGame(true);
        expect(result).not.toBe('human_wins');
      }
    });

    it('should never lose when computer goes second (100 games)', () => {
      for (let i = 0; i < 100; i++) {
        const result = simulateGame(false);
        expect(result).not.toBe('human_wins');
      }
    });

    it('should win or tie in all simulated games', () => {
      let computerWins = 0;
      let ties = 0;
      const totalGames = 200;

      for (let i = 0; i < totalGames; i++) {
        const goesFirst = i % 2 === 0;
        const result = simulateGame(goesFirst);
        if (result === 'computer_wins') computerWins++;
        if (result === 'tie') ties++;
        expect(result).not.toBe('human_wins');
      }

      // Computer should win most games since human is random
      expect(computerWins + ties).toBe(totalGames);
    });
  });

  describe('edge cases', () => {
    it('should handle near-full board', () => {
      const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null];
      const move = getBestMove(board, 'O', 'X');
      expect(move).toBe(8); // Only available move
    });

    it('should work correctly when playing as X', () => {
      const board: Board = ['X', null, null, null, 'O', null, null, null, null];
      const move = getBestMove(board, 'X', 'O');
      // Should make a reasonable move
      expect(getEmptyCells(board)).toContain(move);
    });
  });
});

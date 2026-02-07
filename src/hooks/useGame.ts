import { useReducer, useCallback, useEffect } from 'react';
import { getBestMove } from '../utils/minimax';
import {
  checkWinner,
  isBoardFull,
  createEmptyBoard,
  isValidMove,
} from '../utils/gameLogic';
import type { GameState, GameAction, Player, GameResult, Board } from '../types/game';

const COMPUTER_MOVE_DELAY = 500;

function createInitialState(humanGoesFirst: boolean = true, history): GameState {
  const humanPlayer: Player = humanGoesFirst ? 'X' : 'O';
  const computerPlayer: Player = humanGoesFirst ? 'O' : 'X';

  return {
    board: createEmptyBoard(),
    gameHistory: history || [],
    currentPlayer: 'X', // X always goes first
    humanPlayer,
    computerPlayer,
    gameResult: null,
    isGameOver: false,
    winner: null,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MAKE_MOVE': {
      if (state.isGameOver || !isValidMove(state.board, action.index)) {
        return state;
      }

      const newBoard: Board = [...state.board];
      newBoard[action.index] = state.currentPlayer;

      const winner = checkWinner(newBoard);
      const boardFull = isBoardFull(newBoard);
      const isGameOver = winner !== null || boardFull;

      let gameResult: GameResult = null;
      let history = [...state.gameHistory];
      console.log('state.gameHistory: ', state.gameHistory);

      if (winner === state.humanPlayer) {
        gameResult = 'win';
      } else if (winner === state.computerPlayer) {
        gameResult = 'lose';
      } else if (boardFull) {
        gameResult = 'tie';
      }

      if (gameResult) {
        history.push({
          timeStamp: Date.now(),
          gameResult,
          winner
        });
      }

      return {
        ...state,
        gameHistory: history,
        board: newBoard,
        currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
        winner,
        isGameOver,
        gameResult,
      };
    }

    case 'RESET_GAME': {
      return createInitialState(action.humanGoesFirst, state.gameHistory);
    }

    default:
      return state;
  }
}

export interface UseGameReturn {
  board: Board;
  currentPlayer: Player;
  humanPlayer: Player;
  isGameOver: boolean;
  gameResult: GameResult;
  isHumanTurn: boolean;
  makeMove: (index: number) => void;
  resetGame: (humanGoesFirst: boolean) => void;
}

export function useGame(initialHumanGoesFirst: boolean = true): UseGameReturn {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialHumanGoesFirst,
    createInitialState
  );

  const makeMove = useCallback(
    (index: number) => {
      // Only allow human to make moves on their turn
      if (state.currentPlayer !== state.humanPlayer || state.isGameOver) {
        return;
      }
      dispatch({ type: 'MAKE_MOVE', index });
    },
    [state.currentPlayer, state.humanPlayer, state.isGameOver]
  );

  const resetGame = useCallback((humanGoesFirst: boolean) => {
    dispatch({ type: 'RESET_GAME', humanGoesFirst });
  }, []);

  // Computer move effect
  useEffect(() => {
    if (
      state.currentPlayer === state.computerPlayer &&
      !state.isGameOver
    ) {
      const timeoutId = setTimeout(() => {
        const bestMove = getBestMove(
          state.board,
          state.computerPlayer,
          state.humanPlayer
        );
        dispatch({ type: 'MAKE_MOVE', index: bestMove });
      }, COMPUTER_MOVE_DELAY);

      return () => clearTimeout(timeoutId);
    }
  }, [
    state.currentPlayer,
    state.computerPlayer,
    state.isGameOver,
    state.board,
    state.humanPlayer,
  ]);

  const isHumanTurn = state.currentPlayer === state.humanPlayer && !state.isGameOver;

  return {
    ...state,
    isHumanTurn,
    makeMove,
    resetGame,
  };
}

export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

export type GameResult = 'win' | 'lose' | 'tie' | null;

export interface GameState {
  board: Board;
  gameHistory: any[];
  currentPlayer: Player;
  humanPlayer: Player;
  computerPlayer: Player;
  gameResult: GameResult;
  isGameOver: boolean;
  winner: Player | null;
}

export type GameAction =
  | { type: 'MAKE_MOVE'; index: number; }
  | { type: 'RESET_GAME'; humanGoesFirst: boolean; };

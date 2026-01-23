import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Cell } from '../Cell/Cell';
import { colors, borderRadius } from '../../constants/theme';
import type { Board as BoardType } from '../../types/game';

interface BoardProps {
  board: BoardType;
  onCellPress: (index: number) => void;
  disabled: boolean;
}

const CELL_SIZE = 100;
const BOARD_SIZE = CELL_SIZE * 3;

// Hand-drawn wobbly grid lines
const gridPaths = {
  vertical1: `M ${CELL_SIZE},4 Q ${CELL_SIZE + 3},${BOARD_SIZE / 2} ${CELL_SIZE - 2},${BOARD_SIZE - 4}`,
  vertical2: `M ${CELL_SIZE * 2},4 Q ${CELL_SIZE * 2 - 3},${BOARD_SIZE / 2} ${CELL_SIZE * 2 + 2},${BOARD_SIZE - 4}`,
  horizontal1: `M 4,${CELL_SIZE} Q ${BOARD_SIZE / 2},${CELL_SIZE + 3} ${BOARD_SIZE - 4},${CELL_SIZE - 2}`,
  horizontal2: `M 4,${CELL_SIZE * 2} Q ${BOARD_SIZE / 2},${CELL_SIZE * 2 - 3} ${BOARD_SIZE - 4},${CELL_SIZE * 2 + 2}`,
};

export function Board({ board, onCellPress, disabled }: BoardProps) {
  return (
    <View style={styles.board}>
      {/* Hand-drawn grid lines */}
      <Svg
        width={BOARD_SIZE}
        height={BOARD_SIZE}
        style={StyleSheet.absoluteFill}
      >
        <Path
          d={gridPaths.vertical1}
          stroke={colors.chalkWhite}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />
        <Path
          d={gridPaths.vertical2}
          stroke={colors.chalkWhite}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />
        <Path
          d={gridPaths.horizontal1}
          stroke={colors.chalkWhite}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />
        <Path
          d={gridPaths.horizontal2}
          stroke={colors.chalkWhite}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />
      </Svg>

      {/* Cells */}
      {[0, 1, 2].map((row) => (
        <View key={row} style={styles.row}>
          {[0, 1, 2].map((col) => {
            const index = row * 3 + col;
            return (
              <Cell
                key={index}
                value={board[index]}
                onPress={() => onCellPress(index)}
                disabled={disabled || board[index] !== null}
                position={{ row, col }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    width: BOARD_SIZE,
    height: BOARD_SIZE,
  },
  row: {
    flexDirection: 'row',
  },
});

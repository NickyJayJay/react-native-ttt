import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Cell } from '../Cell/Cell';
import { colors, borderRadius } from '../../constants/theme';
import type { Board as BoardType } from '../../types/game';

interface BoardProps {
  board: BoardType;
  onCellPress: (index: number) => void;
  disabled: boolean;
}

export function Board({ board, onCellPress, disabled }: BoardProps) {
  return (
    <View style={styles.board}>
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
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
  },
});

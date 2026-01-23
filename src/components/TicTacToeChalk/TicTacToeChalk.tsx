import React from "react";
import Svg, { Path, G } from "react-native-svg";
import { View, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

type Props = {
    size?: number;
    color?: string;
};

export function TicTacToeChalk({ size = 175, color = colors.textLight }: Props) {
    return (
        <View style={[styles.container]}>
        <Svg width={size} height={size} viewBox="0 0 300 300" fill="none">

            {/* === GRID === */}
            <G stroke={color} strokeLinecap="round" strokeLinejoin="round">
                {/* Vertical lines */}
                <Path d="M102 5 L98 295" strokeWidth={7} />
                <Path d="M104 8 L100 292" strokeWidth={3} opacity={0.35} />

                <Path d="M202 10 L198 290" strokeWidth={7} />
                <Path d="M204 14 L200 286" strokeWidth={3} opacity={0.35} />

                {/* Horizontal lines */}
                <Path d="M5 98 L295 102" strokeWidth={7} />
                <Path d="M8 100 L292 104" strokeWidth={3} opacity={0.35} />

                <Path d="M10 198 L290 202" strokeWidth={7} />
                <Path d="M14 200 L286 204" strokeWidth={3} opacity={0.35} />
            </G>

            {/* === X (top-left) === */}
            <G stroke={color} strokeLinecap="round">
                <Path d="M30 30 L70 70" strokeWidth={7} />
                <Path d="M72 28 L28 72" strokeWidth={6} />
                <Path d="M32 32 L68 68" strokeWidth={3} opacity={0.4} />
            </G>

            {/* === O (top-middle) === */}
            <G stroke={color} strokeLinecap="round" strokeLinejoin="round">
                <Path
                    d="
          M150 35
          C175 30, 190 55, 180 75
          C170 95, 130 95, 120 75
          C110 55, 125 30, 150 35
        "
                    strokeWidth={6}
                />
                <Path
                    d="
          M152 38
          C170 34, 184 56, 176 74
          C166 90, 134 90, 124 74
          C116 56, 130 34, 152 38
        "
                    strokeWidth={3}
                    opacity={0.35}
                />
            </G>

            {/* === X (center) === */}
            <G stroke={color} strokeLinecap="round">
                <Path d="M130 130 L170 170" strokeWidth={7} />
                <Path d="M172 128 L128 172" strokeWidth={6} />
                <Path d="M132 132 L168 168" strokeWidth={3} opacity={0.35} />
            </G>

            {/* === O (bottom-left) === */}
            <G stroke={color} strokeLinecap="round" strokeLinejoin="round">
                <Path
                    d="
          M50 235
          C75 225, 90 250, 80 270
          C70 290, 30 290, 20 270
          C10 250, 25 225, 50 235
        "
                    strokeWidth={6}
                />
                <Path
                    d="
          M52 238
          C72 230, 86 250, 78 266
          C68 284, 32 284, 24 266
          C16 248, 30 230, 52 238
        "
                    strokeWidth={3}
                    opacity={0.35}
                />
            </G>

            {/* === X (bottom-right) === */}
            <G stroke={color} strokeLinecap="round">
                <Path d="M230 230 L270 270" strokeWidth={7} />
                <Path d="M272 228 L228 272" strokeWidth={6} />
                <Path d="M232 232 L268 268" strokeWidth={3} opacity={0.35} />
            </G>

        </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 30
    },
});

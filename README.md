# Tic Tac Toe - React Native

An unbeatable single-player Tic Tac Toe game built with React Native and Expo. The computer opponent uses the Minimax algorithm to play optimally, ensuring it never loses.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (optional, for testing on physical devices)

### Installation & Running

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

After starting the development server:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan the QR code with Expo Go app on your physical device

### Running Tests

```bash
npm test
```

## Technical Approach

### Architecture

The app follows a clean separation of concerns:

```
src/
├── components/     # Presentational UI components
├── hooks/          # Business logic (useGame)
├── utils/          # Pure functions (minimax, gameLogic)
├── types/          # TypeScript definitions
└── constants/      # Theme configuration
```

### AI Algorithm: Minimax

The computer player uses the **Minimax algorithm**, a recursive decision-making algorithm that guarantees optimal play.

**How it works:**

1. **Recursive Exploration**: From the current board state, the algorithm simulates every possible move sequence to the end of the game.

2. **Terminal State Scoring**:
   - Computer wins: +10 (minus depth to prefer faster wins)
   - Human wins: -10 (plus depth to prefer slower losses)
   - Tie: 0

3. **Decision Making**:
   - On computer's turn: Choose the move with the **maximum** score
   - On human's turn: Assume human picks the **minimum** score (optimal defense)

4. **Why It's Unbeatable**: Since Minimax evaluates all possible outcomes, it always takes winning moves when available, always blocks opponent winning moves, and never makes a move leading to a loss if avoidable.

For a 3x3 board, the game tree is small enough (~362,880 states max) that no optimization like alpha-beta pruning is needed.

### State Management

Game state is managed using React's `useReducer` hook:

- **Board State**: Array of 9 cells (null, 'X', or 'O')
- **Player Tracking**: Current player, human player, computer player
- **Game Status**: Game over flag, result (win/lose/tie)

The `useGame` hook encapsulates all game logic and automatically triggers computer moves with a 500ms delay for natural-feeling gameplay.

### UI Design: Chalkboard Theme

The UI features a playful chalkboard aesthetic to create a nostalgic, hand-drawn feel:

- **Schoolbell Font**: A chalk-style Google Font for all text elements
- **Hand-drawn SVG Graphics**: Custom chalk-style X's, O's, and grid lines with slight imperfections for authenticity
- **Animations**: Smooth entry animations when symbols appear on the board using React Native Reanimated

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native 0.81 | Cross-platform mobile framework |
| Expo SDK 54 | Development tooling and APIs |
| Expo Router | File-based navigation |
| TypeScript | Type safety |
| React Native Reanimated | Smooth animations |
| React Native SVG | Chalk-style vector graphics |
| Schoolbell Font | Chalk-style typography |
| Jest | Testing framework |
| React Native Testing Library | Component testing |
| ESLint | Code linting |
| Prettier | Code formatting |

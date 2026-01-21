# Tic Tac Toe - React Native + Expo

An unbeatable single-player Tic Tac Toe game built with React Native and Expo. The computer opponent uses the Minimax algorithm to play optimally, ensuring it never loses.

## Features

- Play against an unbeatable AI powered by the Minimax algorithm
- Choose to go first (X) or let the computer start (O)
- Smooth animations using React Native Reanimated
- Clean, responsive UI that works on iOS and Android
- Comprehensive test suite with 57 passing tests
- TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (optional, for testing on physical devices)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd react-native-ttt

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

After starting the development server:

- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan the QR code with Expo Go app on your physical device

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## Technical Approach

### Architecture

The app follows a clean architecture with separation of concerns:

```
src/
├── components/     # Presentational components
├── hooks/          # Business logic (useGame)
├── utils/          # Pure functions (minimax, gameLogic)
├── types/          # TypeScript definitions
└── constants/      # Theme configuration
```

### AI Algorithm: Minimax

The computer player uses the **Minimax algorithm**, which guarantees optimal play. Here's how it works:

1. **Recursive Exploration**: Starting from the current board state, the algorithm simulates every possible move to the end of the game.

2. **Terminal State Scoring**:
   - Computer wins: +10 (minus depth, to prefer faster wins)
   - Human wins: -10 (plus depth, to prefer slower losses)
   - Tie: 0

3. **Decision Making**:
   - On computer's turn: Choose the move with the **maximum** score
   - On human's turn: Assume human picks the **minimum** score (optimal defense)

4. **Why It's Unbeatable**: Since Minimax evaluates ALL possible outcomes, it will:
   - Always take winning moves when available
   - Always block opponent's winning moves
   - Never make a move that leads to a loss if avoidable

For a 3x3 Tic Tac Toe board, the maximum game tree is small enough (9! ≈ 362,880 states) that no optimization like alpha-beta pruning is needed.

### State Management

The game uses React's `useReducer` hook for predictable state management:

- **Board State**: Array of 9 cells (null, 'X', or 'O')
- **Player Tracking**: Current player, human player, computer player
- **Game Status**: Game over flag, result (win/lose/tie)

The `useGame` hook encapsulates all game logic and automatically triggers computer moves with a 500ms delay for better UX.

### Testing Strategy

Tests focus on business logic rather than implementation details:

- **Unit Tests (gameLogic.ts)**: Win detection, board utilities - 100% coverage
- **Unit Tests (minimax.ts)**: AI behavior verification, includes simulation tests that run 100+ random games to prove the AI never loses
- **Integration Tests**: Full game flow simulation

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native 0.81 | Cross-platform mobile framework |
| Expo SDK 54 | Development tooling and APIs |
| Expo Router | File-based navigation |
| TypeScript 5.x | Type safety |
| React Native Reanimated | Smooth animations |
| Jest | Testing framework |
| ESLint + Prettier | Code quality |

## Project Structure

```
react-native-ttt/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout
│   ├── index.tsx                 # Home screen
│   └── game.tsx                  # Game screen
├── src/
│   ├── components/
│   │   ├── Board/                # 3x3 grid component
│   │   ├── Cell/                 # Individual cell with animations
│   │   ├── Button/               # Reusable button
│   │   └── ResultModal/          # Win/Lose/Tie modal
│   ├── hooks/
│   │   └── useGame.ts            # Game state management
│   ├── utils/
│   │   ├── minimax.ts            # Minimax AI algorithm
│   │   └── gameLogic.ts          # Win detection, board utilities
│   ├── types/
│   │   └── game.ts               # TypeScript definitions
│   └── constants/
│       └── theme.ts              # Colors, spacing, typography
├── __tests__/                    # Test files
├── app.json                      # Expo configuration
├── package.json
├── tsconfig.json
├── jest.config.js
├── eslint.config.mjs
└── .prettierrc
```

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| AI Algorithm | Minimax | Provably optimal, simpler than rules-based |
| State Management | useReducer | Sufficient for single-screen state |
| Navigation | Expo Router | Modern file-based routing |
| Animations | Reanimated | Native performance, declarative API |
| Computer Move Delay | 500ms | Natural-feeling gameplay |

## License

MIT

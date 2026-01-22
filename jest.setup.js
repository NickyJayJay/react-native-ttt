import '@testing-library/react-native';

// Mock react-native-reanimated using the official mock
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock doesn't include this property
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence console errors about animated values in tests
global.console = {
  ...console,
  warn: jest.fn(),
};

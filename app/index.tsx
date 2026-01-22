import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components';
import { colors, spacing, fontSize } from '../src/constants/theme';

export default function HomeScreen() {
  const startGame = (humanGoesFirst: boolean) => {
    router.push({
      pathname: '/game',
      params: { humanGoesFirst: humanGoesFirst.toString() },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Tic Tac Toe</Text>
          <Text style={styles.subtitle}>Can you beat the unbeatable AI?</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="I'll Go First (X)"
            onPress={() => startGame(true)}
            variant="primary"
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Computer Goes First"
            onPress={() => startGame(false)}
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: fontSize.xxl + 8,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textLight,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  buttonSpacer: {
    height: spacing.md,
  },
});

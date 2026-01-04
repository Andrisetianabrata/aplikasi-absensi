import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  warning?: string | null;
}

/**
 * Red Flag Badge - Displayed when employee is on red list (performance < 10)
 */
export function RedFlagBadge({ warning }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🚩</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Performance Warning</Text>
        <Text style={styles.subtitle}>
          {warning || 'Your score is below the required threshold'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    color: '#FECACA',
    fontSize: 13,
    lineHeight: 18,
  },
});

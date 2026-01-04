import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { TimeDebt } from '../../types/api';

interface Props {
  totalMinutes: number;
  pendingCount: number;
  debts: TimeDebt[];
  alertMessage: string;
  nextDueDate?: string | null;
}

/**
 * Debt Alert Banner - Shows when user has pending time debts
 */
export function DebtAlertBanner({
  totalMinutes,
  pendingCount,
  alertMessage,
  nextDueDate
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>⏰</Text>
        <Text style={styles.title}>Time Debt</Text>
      </View>

      <Text style={styles.message}>{alertMessage}</Text>

      {nextDueDate && (
        <Text style={styles.dueDate}>
          Next payment due: {nextDueDate}
        </Text>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalMinutes}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.helpButton} activeOpacity={0.7}>
        <Text style={styles.helpButtonText}>How to clear debt? →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  dueDate: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#334155',
  },
  helpButton: {
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '500',
  },
});

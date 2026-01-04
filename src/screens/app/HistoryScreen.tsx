import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { apiClient } from '../../services/api/client';
import { useAuth } from '../../contexts/AuthContext';
import type { Attendance, ApiResponse } from '../../types/api';
import type { AppTabScreenProps } from '../../types/navigation';

interface HistoryData {
  employee: { id: number; name: string };
  attendances: Attendance[];
}

export function HistoryScreen({ }: AppTabScreenProps<'History'>) {
  const { companies } = useAuth();
  const [history, setHistory] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const employeeId = companies[0]?.employee_id;

  const fetchHistory = async () => {
    if (!employeeId) return;

    try {
      const response = await apiClient.get<ApiResponse<HistoryData>>(
        `/attendance/history?employee_id=${employeeId}&days=30`
      );
      if (response.data.success) {
        setHistory(response.data.data.attendances);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [employeeId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#4F46E5"
          colors={['#4F46E5']}
        />
      }
    >
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <Text style={styles.title}>Attendance History</Text>
      <Text style={styles.subtitle}>Last 30 days</Text>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>No attendance records yet</Text>
        </View>
      ) : (
        <View style={styles.historyList}>
          {history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.dateColumn}>
                <Text style={styles.dateDay}>{formatDay(item.date)}</Text>
                <Text style={styles.dateMonth}>{formatMonth(item.date)}</Text>
              </View>
              <View style={styles.detailsColumn}>
                <View style={styles.timeRow}>
                  <Text style={styles.timeLabel}>In:</Text>
                  <Text style={styles.timeValue}>{item.check_in_time || '--:--'}</Text>
                </View>
                <View style={styles.timeRow}>
                  <Text style={styles.timeLabel}>Out:</Text>
                  <Text style={styles.timeValue}>{item.check_out_time || '--:--'}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                <Text style={styles.statusText}>{formatStatus(item.status)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function formatDay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.getDate().toString().padStart(2, '0');
}

function formatMonth(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en', { month: 'short' });
}

function formatStatus(status: string): string {
  switch (status) {
    case 'ON_TIME': return 'On Time';
    case 'LATE': return 'Late';
    case 'ABSENT': return 'Absent';
    default: return status;
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'ON_TIME':
      return { backgroundColor: 'rgba(34, 197, 94, 0.2)' };
    case 'LATE':
      return { backgroundColor: 'rgba(245, 158, 11, 0.2)' };
    case 'ABSENT':
      return { backgroundColor: 'rgba(239, 68, 68, 0.2)' };
    default:
      return { backgroundColor: 'rgba(100, 116, 139, 0.2)' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 16,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateColumn: {
    width: 50,
    alignItems: 'center',
    marginRight: 16,
  },
  dateDay: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
  },
  dateMonth: {
    color: '#64748B',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  detailsColumn: {
    flex: 1,
    gap: 4,
  },
  timeRow: {
    flexDirection: 'row',
  },
  timeLabel: {
    color: '#64748B',
    fontSize: 13,
    width: 36,
  },
  timeValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '600',
  },
});

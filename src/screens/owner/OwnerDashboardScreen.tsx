import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { THEME } from '../../theme/theme';
import { Users, CheckCircle, Clock, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ownerService } from '../../services/api/client';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingScreen } from '../../components/screens/LoadingScreen';

export function OwnerDashboardScreen({ navigation }: any) {
  const { companies, user } = useAuth();
  const companyId = companies.find(c => c.is_owner)?.company_id;

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    if (!companyId) return;
    try {
      const response = await ownerService.getDashboard(companyId);
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch owner dashboard:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [companyId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading Dashboard..." />;
  }

  const { summary, employees } = data || { summary: {}, employees: [] };

  const StatCard = ({ title, value, icon, color, subtext }: any) => (
    <View style={styles.statCard}>
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <View>
        <Text style={styles.statValue}>{value || 0}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtext && <Text style={[styles.statSubtext, { color }]}>{subtext}</Text>}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.name}>{user?.name} (Owner)</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.grid}>
          <StatCard
            title="Total Staff"
            value={summary?.total_employees}
            icon={<Users size={20} color={THEME.colors.primary} />}
            color={THEME.colors.primary}
          />
          <StatCard
            title="Present"
            value={summary?.checked_in_today}
            icon={<CheckCircle size={20} color={THEME.colors.status.success} />}
            color={THEME.colors.status.success}
            subtext="Checked In Today"
          />
          <StatCard
            title="Late"
            value={summary?.late_today}
            icon={<Clock size={20} color={THEME.colors.status.warning} />}
            color={THEME.colors.status.warning}
          />
          <StatCard
            title="Red List"
            value={summary?.red_list_count}
            icon={<AlertTriangle size={20} color={THEME.colors.status.danger} />}
            color={THEME.colors.status.danger}
          />
        </View>

        {/* Staff Management Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Staff Overview</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {employees?.slice(0, 5).map((staff: any) => (
            <TouchableOpacity
              key={staff.id}
              style={styles.staffRow}
              onPress={() => navigation.navigate('EmployeeDetail', { employeeId: staff.id })}
            >
              <View style={styles.staffInfo}>
                <View style={styles.staffAvatar}>
                  <Text style={styles.staffAvatarText}>{staff.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.staffName}>{staff.name}</Text>
                  <Text style={styles.staffRole}>{staff.position}</Text>
                </View>
              </View>

              <View style={styles.scoreBadge}>
                {staff.is_red_list ? (
                  <AlertTriangle size={16} color={THEME.colors.status.danger} />
                ) : staff.today_status === 'LATE' ? (
                  <Clock size={16} color={THEME.colors.status.warning} />
                ) : (
                  <CheckCircle size={16} color={THEME.colors.status.success} />
                )}
                <ChevronRight size={16} color={THEME.colors.text.muted} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Users size={24} color="#FFF" />
              <Text style={styles.actionText}>Add Staff</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: THEME.colors.status.info }]}>
              <Clock size={24} color="#FFF" />
              <Text style={styles.actionText}>Shift Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: THEME.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.l,
  },
  greeting: {
    fontSize: THEME.fonts.sizes.m,
    color: THEME.colors.text.secondary,
  },
  name: {
    fontSize: THEME.fonts.sizes.l,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: THEME.fonts.sizes.l,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.m,
    marginBottom: THEME.spacing.l,
  },
  statCard: {
    width: '47%',
    backgroundColor: THEME.colors.card,
    padding: THEME.spacing.m,
    borderRadius: 16,
    ...THEME.shadows.small,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.s,
  },
  statValue: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
  },
  statTitle: {
    fontSize: THEME.fonts.sizes.s,
    color: THEME.colors.text.secondary,
  },
  statSubtext: {
    fontSize: THEME.fonts.sizes.xs,
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    marginBottom: THEME.spacing.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.m,
  },
  sectionTitle: {
    fontSize: THEME.fonts.sizes.l,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
  },
  seeAll: {
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  staffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.card,
    padding: THEME.spacing.m,
    borderRadius: 12,
    marginBottom: THEME.spacing.s,
    ...THEME.shadows.small,
  },
  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.m,
  },
  staffAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffAvatarText: {
    fontWeight: 'bold',
    color: THEME.colors.text.secondary,
  },
  staffName: {
    fontWeight: '600',
    color: THEME.colors.text.primary,
    fontSize: THEME.fonts.sizes.m,
  },
  staffRole: {
    color: THEME.colors.text.muted,
    fontSize: THEME.fonts.sizes.s,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.s,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: THEME.spacing.m,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    padding: THEME.spacing.m,
    borderRadius: 12,
    gap: THEME.spacing.s,
  },
  actionText: {
    color: '#FFF',
    fontWeight: '600',
  }
});

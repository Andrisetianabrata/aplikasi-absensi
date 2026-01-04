import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { attendanceService } from '../../services/api/client';
import { LoadingScreen } from '../../components/screens/LoadingScreen';
import { THEME } from '../../theme/theme';
import { LogIn, LogOut, Clock, AlertOctagon, MapPin, Calendar, User as UserIcon } from 'lucide-react-native';

import { useSnackbar } from '../../contexts/SnackbarContext';

export function DashboardScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { showSnackbar } = useSnackbar();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: attendanceService.getDashboard
  });

  const handleLogout = async () => {
    try {
      await logout();
      showSnackbar('Logged out successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to logout', 'error');
    }
  };

  if (isLoading && !data) {
    return <LoadingScreen message="Loading Dashboard..." />;
  }

  const { employee, today, debt_alert } = data?.data || {};
  const isCheckedIn = today?.check_in && !today?.check_out;

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground} />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#FFF" />}
        >
          {/* Glassmorphism Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.userInfoContainer}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                </View>
                <View>
                  <Text style={styles.welcomeText}>Welcome back,</Text>
                  <Text style={styles.userName}>{user?.name}</Text>
                  <View style={styles.locationBadge}>
                    <MapPin size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.locationText}>{employee?.company || 'Volta HQ'}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <LogOut size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statLabel}>Position</Text>
                <Text style={styles.statValue}>{employee?.position || '-'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.statLabel}>Date</Text>
                <Text style={styles.statValue}>{today?.day_name}, {today?.date}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.checkInButton, isCheckedIn && styles.disabledButton]}
              onPress={() => !isCheckedIn && navigation.navigate('Attendance')}
              disabled={isCheckedIn}
            >
              <View style={styles.iconCircle}>
                <LogIn size={24} color={THEME.colors.primary} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Check In</Text>
                <Text style={styles.actionTime}>{today?.check_in ? today.check_in : '-- : --'}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.checkOutButton, !isCheckedIn && styles.disabledButton]}
              onPress={() => isCheckedIn && navigation.navigate('Attendance')}
              disabled={!isCheckedIn}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                <LogOut size={24} color={THEME.colors.status.danger} />
              </View>
              <View>
                <Text style={[styles.actionTitle, { color: THEME.colors.status.danger }]}>Check Out</Text>
                <Text style={styles.actionTime}>{today?.check_out ? today.check_out : '-- : --'}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Alerts Section */}
          <View style={styles.alertsContainer}>
            {employee?.is_red_list && (
              <View style={[styles.alertCard, { backgroundColor: THEME.colors.danger.bg }]}>
                <AlertOctagon size={24} color={THEME.colors.danger.text} />
                <View style={styles.alertContent}>
                  <Text style={[styles.alertTitle, { color: THEME.colors.danger.text }]}>PERFORMANCE WARNING</Text>
                  <Text style={[styles.alertMessage, { color: THEME.colors.danger.text }]}>
                    {employee.red_list_warning || "You are on the Red List. Please improve your attendance immediately."}
                  </Text>
                </View>
              </View>
            )}

            {debt_alert?.has_debt && (
              <View style={[styles.alertCard, { backgroundColor: '#FFF7ED' }]}>
                <Clock size={24} color={THEME.colors.status.warning} />
                <View style={styles.alertContent}>
                  <Text style={[styles.alertTitle, { color: '#9A3412' }]}>TIME DEBT ALERT</Text>
                  <Text style={[styles.alertMessage, { color: '#9A3412' }]}>
                    {debt_alert.alert_message || "You have outstanding time debt."}
                  </Text>
                </View>
              </View>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: THEME.colors.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.m,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: THEME.spacing.l,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: THEME.spacing.l,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.m,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.m,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    color: '#FFF',
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: THEME.fonts.sizes.s,
  },
  userName: {
    color: '#FFF',
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  locationText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: THEME.fonts.sizes.xs,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: THEME.spacing.m,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: THEME.fonts.sizes.xs,
    marginBottom: 2,
  },
  statValue: {
    color: '#FFF',
    fontSize: THEME.fonts.sizes.m,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: THEME.spacing.m,
    marginBottom: THEME.spacing.l,
  },
  actionButton: {
    flex: 1,
    backgroundColor: THEME.colors.card,
    padding: THEME.spacing.m,
    borderRadius: 20,
    ...THEME.shadows.medium,
    height: 120, // Taller buttons
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.l,
  },
  checkInButton: {

  },
  checkOutButton: {

  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#F1F5F9',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  actionTitle: {
    fontSize: THEME.fonts.sizes.l,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: 2,
  },
  actionTime: {
    fontSize: THEME.fonts.sizes.s,
    color: THEME.colors.text.secondary,
    fontWeight: '500',
  },
  alertsContainer: {
    gap: THEME.spacing.m,
  },
  alertCard: {
    flexDirection: 'row',
    padding: THEME.spacing.m,
    borderRadius: 16,
    gap: THEME.spacing.m,
    alignItems: 'flex-start',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontWeight: 'bold',
    fontSize: THEME.fonts.sizes.s,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: THEME.fonts.sizes.s,
    lineHeight: 20,
  }
});

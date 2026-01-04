import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { THEME } from '../../theme/theme';
import { Bell, Lock, HelpCircle, LogOut, ChevronRight, Building, Key, ShieldCheck, User } from 'lucide-react-native';
import type { AppTabScreenProps } from '../../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ProfileScreen({ }: AppTabScreenProps<'Profile'>) {
  const { user, companies, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const isOwner = companies?.some(c => c.is_owner);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.primary} />
      <View style={styles.headerBackground} />

      <SafeAreaView style={styles.safeArea}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || '?'}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.email}>{user?.email || ''}</Text>
            {isOwner && (
              <View style={styles.ownerBadge}>
                <ShieldCheck size={12} color="#FFF" />
                <Text style={styles.ownerText}>Owner Account</Text>
              </View>
            )}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Company Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Companies</Text>
            {companies.length > 0 ? (
              companies.map((company) => (
                <View key={company.company_id} style={styles.companyCard}>
                  <View style={styles.companyIcon}>
                    <Building size={24} color={THEME.colors.primary} />
                  </View>
                  <View style={styles.companyInfo}>
                    <Text style={styles.companyName}>{company.company_name}</Text>
                    <View style={styles.codeRow}>
                      <Key size={12} color={THEME.colors.text.muted} />
                      <Text style={styles.companyCode}>Code: <Text style={styles.codeValue}>{company.company_code}</Text></Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, getStatusStyle(company.status)]}>
                    <Text style={[styles.statusText, getStatusTextStyle(company.status)]}>{company.status}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No companies associated</Text>
              </View>
            )}
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Bell size={20} color={THEME.colors.primary} />
                </View>
                <Text style={styles.menuText}>Notifications</Text>
                <ChevronRight size={20} color="#CBD5E1" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIcon, { backgroundColor: '#F0FDF4' }]}>
                  <Lock size={20} color="#166534" />
                </View>
                <Text style={styles.menuText}>Privacy & Security</Text>
                <ChevronRight size={20} color="#CBD5E1" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIcon, { backgroundColor: '#FFF7ED' }]}>
                  <HelpCircle size={20} color="#DD6B20" />
                </View>
                <Text style={styles.menuText}>Help & Support</Text>
                <ChevronRight size={20} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={THEME.colors.status.danger} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Volta v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'APPROVED':
      return { backgroundColor: '#DCFCE7' };
    case 'PENDING':
      return { backgroundColor: '#FEF9C3' };
    default:
      return { backgroundColor: '#F1F5F9' };
  }
}

function getStatusTextStyle(status: string) {
  switch (status) {
    case 'APPROVED':
      return { color: '#166534' };
    case 'PENDING':
      return { color: '#854D0E' };
    default:
      return { color: '#64748B' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: THEME.colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  ownerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 4,
  },
  ownerText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  companyCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    ...THEME.shadows.small,
  },
  companyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  companyCode: {
    color: '#64748B',
    fontSize: 12,
  },
  codeValue: {
    fontWeight: '700',
    color: '#334155',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    ...THEME.shadows.small,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 60,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});

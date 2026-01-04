import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { THEME } from '../../theme/theme';
import { Edit2, RotateCcw, Trash2, ArrowLeft, Shield, Clock, AlertTriangle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function EmployeeDetailScreen({ navigation, route }: any) {
  // const { employeeId } = route.params;

  // Mock Data
  const employee = {
    id: 1,
    name: 'Toni Kross',
    position: 'Manager',
    email: 'toni@example.com',
    joinDate: 'Jan 20, 2024',
    status: 'ACTIVE',
  };

  const menuItems = [
    {
      id: 'edit',
      label: 'Edit Profile',
      icon: Edit2,
      color: THEME.colors.text.primary,
      action: () => console.log('Edit'),
    },
    {
      id: 'reset_face',
      label: 'Reset Face ID',
      icon: RotateCcw,
      color: THEME.colors.status.warning,
      action: () => Alert.alert('Reset Face ID', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive' }
      ]),
    },
    {
      id: 'delete',
      label: 'Deactivate Account',
      icon: Trash2,
      color: THEME.colors.status.danger,
      action: () => Alert.alert('Deactivate', 'This action cannot be undone.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Deactivate', style: 'destructive' }
      ]),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={THEME.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>{employee.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{employee.name}</Text>
          <Text style={styles.role}>{employee.position}</Text>
          <View style={styles.statusBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.statusText}>{employee.status}</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{employee.email}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Joined</Text>
            <Text style={styles.infoValue}>{employee.joinDate}</Text>
          </View>
        </View>

        {/* Control Panel */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Control Panel</Text>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <item.icon size={20} color={item.color} />
              </View>
              <Text style={[styles.menuText, { color: item.color === THEME.colors.text.primary ? THEME.colors.text.primary : item.color }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    backgroundColor: THEME.colors.card,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: THEME.fonts.sizes.l,
    fontWeight: 'bold',
  },
  content: {
    padding: THEME.spacing.l,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.m,
    ...THEME.shadows.medium,
  },
  avatarTextLarge: {
    fontSize: 40,
    color: '#FFF',
    fontWeight: 'bold',
  },
  name: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: 4,
  },
  role: {
    fontSize: THEME.fonts.sizes.m,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.m,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.status.success,
  },
  statusText: {
    color: '#166534',
    fontWeight: '600',
    fontSize: THEME.fonts.sizes.s,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: THEME.spacing.m,
    marginBottom: THEME.spacing.xl,
  },
  infoCard: {
    flex: 1,
    backgroundColor: THEME.colors.card,
    padding: THEME.spacing.m,
    borderRadius: 12,
    ...THEME.shadows.small,
  },
  infoLabel: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.text.muted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: THEME.fonts.sizes.s,
    fontWeight: '600',
    color: THEME.colors.text.primary,
  },
  menuContainer: {
    backgroundColor: THEME.colors.card,
    borderRadius: 16,
    padding: THEME.spacing.m,
    ...THEME.shadows.small,
  },
  menuTitle: {
    fontSize: THEME.fonts.sizes.m,
    fontWeight: 'bold',
    color: THEME.colors.text.muted,
    marginBottom: THEME.spacing.m,
    marginLeft: THEME.spacing.s,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.m,
    paddingHorizontal: THEME.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.m,
  },
  menuText: {
    fontSize: THEME.fonts.sizes.m,
    fontWeight: '500',
  }

});

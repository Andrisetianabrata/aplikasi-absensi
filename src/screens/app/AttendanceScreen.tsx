import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useLocationService } from '../../hooks/useLocationService';
import type { AppTabScreenProps } from '../../types/navigation';

export function AttendanceScreen({ navigation }: AppTabScreenProps<'Attendance'>) {
  const { isGpsEnabled, checkGpsStatus, openLocationSettings } = useLocationService();

  const handleCheckIn = () => {
    navigation.navigate('AttendanceCamera', { mode: 'check-in' });
  };

  const handleCheckOut = () => {
    navigation.navigate('AttendanceCamera', { mode: 'check-out' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <Text style={styles.title}>Mark Attendance</Text>
      <Text style={styles.subtitle}>
        Position your face in the camera for verification
      </Text>

      {/* Camera Preview Placeholder */}
      <View style={styles.cameraPreview}>
        <Text style={styles.cameraIcon}>📷</Text>
        <Text style={styles.cameraText}>Face Recognition Camera</Text>
      </View>

      {/* GPS Status */}
      {!isGpsEnabled ? (
        <View style={styles.gpsWarning}>
          <Text style={styles.gpsWarningIcon}>📍</Text>
          <View style={styles.gpsWarningContent}>
            <Text style={styles.gpsWarningTitle}>GPS Required</Text>
            <Text style={styles.gpsWarningText}>
              Enable location services to mark attendance
            </Text>
          </View>
          <TouchableOpacity style={styles.enableButton} onPress={openLocationSettings}>
            <Text style={styles.enableButtonText}>Enable</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gpsOk}>
          <Text style={styles.gpsOkText}>📍 Location ready</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.checkInButton, !isGpsEnabled && styles.buttonDisabled]}
          onPress={handleCheckIn}
          disabled={!isGpsEnabled}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonIcon}>☀️</Text>
          <Text style={styles.buttonText}>Check In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.checkOutButton, !isGpsEnabled && styles.buttonDisabled]}
          onPress={handleCheckOut}
          disabled={!isGpsEnabled}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonIcon}>🌙</Text>
          <Text style={styles.buttonText}>Check Out</Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          🔒 Your face data stays on this device. We never send images to our servers.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 24,
  },
  cameraPreview: {
    height: 200,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  cameraIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cameraText: {
    color: '#64748B',
    fontSize: 14,
  },
  gpsWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  gpsWarningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  gpsWarningContent: {
    flex: 1,
  },
  gpsWarningTitle: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
  },
  gpsWarningText: {
    color: '#FCD34D',
    fontSize: 12,
    marginTop: 2,
  },
  enableButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  enableButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  gpsOk: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  gpsOkText: {
    color: '#22C55E',
    fontSize: 13,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  checkInButton: {
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E',
  },
  checkOutButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  buttonDisabled: {
    backgroundColor: '#334155',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.3)',
  },
  infoText: {
    color: '#A5B4FC',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

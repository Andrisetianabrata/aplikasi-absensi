import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { THEME } from '../../theme/theme';
import { ShieldCheck, Camera, MapPin } from 'lucide-react-native';

interface PermissionReason {
  icon: string;
  text: string;
}

interface Props {
  title: string;
  description: string;
  reasons: PermissionReason[];
  onRequest: () => void;
}

export function PermissionRequestScreen({ title, description, reasons, onRequest }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Shield Icon */}
      <View style={styles.iconContainer}>
        <ShieldCheck size={56} color={THEME.colors.primary} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.reasonsContainer}>
        {reasons.map((reason, index) => (
          <View key={index} style={styles.reasonRow}>
            <View style={styles.reasonIconBox}>
              {reason.icon === 'camera' ? (
                <Camera size={24} color={THEME.colors.primary} />
              ) : (
                <MapPin size={24} color={THEME.colors.primary} />
              )}
            </View>
            <Text style={styles.reasonText}>{reason.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          🔒 Your data stays on your device. We never send your photos to any server.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onRequest} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Allow Permissions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  reasonsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 12,
    ...THEME.shadows.small,
  },
  reasonIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  reasonText: {
    flex: 1,
    fontSize: 14,
    color: THEME.colors.text.primary,
    lineHeight: 20,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoText: {
    color: THEME.colors.text.secondary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  button: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    width: '100%',
    ...THEME.shadows.medium,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

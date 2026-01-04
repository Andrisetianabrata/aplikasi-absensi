import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

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
        <Text style={styles.iconEmoji}>🛡️</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.reasonsContainer}>
        {reasons.map((reason, index) => (
          <View key={index} style={styles.reasonRow}>
            <Text style={styles.reasonIcon}>
              {reason.icon === 'camera' ? '📷' : '📍'}
            </Text>
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
    backgroundColor: '#0F172A',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#334155',
  },
  iconEmoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#94A3B8',
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  reasonIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  reasonText: {
    flex: 1,
    fontSize: 15,
    color: '#E2E8F0',
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.3)',
  },
  infoText: {
    color: '#A5B4FC',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 14,
    width: '100%',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { THEME } from '../../theme/theme';
import { Settings, ExternalLink, CheckCircle } from 'lucide-react-native';

interface Props {
  title: string;
  description: string;
  onOpenSettings: () => void;
  onRetry: () => void;
}

export function SettingsRequiredScreen({ title, description, onOpenSettings, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Settings Icon */}
      <View style={styles.iconContainer}>
        <Settings size={48} color={THEME.colors.status.warning} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>How to enable manually:</Text>
        {[
          'Tap "Open Settings" below',
          'Find "Permissions" or "App Permissions"',
          'Enable Camera and Location',
          'Come back and tap "I\'ve Enabled"'
        ].map((step, index) => (
          <View key={index} style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onOpenSettings} activeOpacity={0.8}>
        <ExternalLink size={20} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.primaryButtonText}>Open Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={onRetry} activeOpacity={0.6}>
        <CheckCircle size={20} color={THEME.colors.primary} style={{ marginRight: 8 }} />
        <Text style={styles.secondaryButtonText}>I've enabled permissions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.colors.text.primary,
    marginBottom: 8,
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
  stepsContainer: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepsTitle: {
    color: THEME.colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    color: THEME.colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.status.warning,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    marginBottom: 16,
    ...THEME.shadows.medium,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  secondaryButtonText: {
    color: THEME.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

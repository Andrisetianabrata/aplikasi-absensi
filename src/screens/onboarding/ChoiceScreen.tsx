import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import type { OnboardingScreenProps } from '../../types/navigation';

export function ChoiceScreen({ navigation }: OnboardingScreenProps<'Choice'>) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome! 👋</Text>
        <Text style={styles.subtitle}>
          Let's get you set up with your workplace
        </Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {/* Join Company */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate('JoinBusiness')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionIcon}>🏢</Text>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Join a Company</Text>
            <Text style={styles.optionDescription}>
              I have a company code from my employer
            </Text>
          </View>
          <Text style={styles.optionArrow}>→</Text>
        </TouchableOpacity>

        {/* Create Company */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate('CreateCompany')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionIcon}>🚀</Text>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Register a Company</Text>
            <Text style={styles.optionDescription}>
              I want to create attendance for my team
            </Text>
          </View>
          <Text style={styles.optionArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 You can join multiple companies later from your profile settings
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 24,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  optionArrow: {
    fontSize: 24,
    color: '#4F46E5',
  },
  infoBox: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.3)',
  },
  infoText: {
    color: '#A5B4FC',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});

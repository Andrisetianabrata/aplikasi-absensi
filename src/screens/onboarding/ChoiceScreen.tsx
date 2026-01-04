import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { THEME } from '../../theme/theme';
import { Building2, Rocket, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { OnboardingScreenProps } from '../../types/navigation';

export function ChoiceScreen({ navigation }: OnboardingScreenProps<'Choice'>) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.primary} />

      {/* Background Decor */}
      <View style={styles.headerBackground} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>

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
              <View style={styles.iconBox}>
                <Building2 size={32} color={THEME.colors.primary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Join a Company</Text>
                <Text style={styles.optionDescription}>
                  I have a company code from my employer
                </Text>
              </View>
              <ArrowRight size={24} color={THEME.colors.text.muted} />
            </TouchableOpacity>

            {/* Create Company */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => navigation.navigate('CreateCompany')}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, styles.createBox]}>
                <Rocket size={32} color="#FFF" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Register a Company</Text>
                <Text style={styles.optionDescription}>
                  I want to create attendance for my team
                </Text>
              </View>
              <ArrowRight size={24} color={THEME.colors.text.muted} />
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 You can join multiple companies later from your profile settings
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
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
    height: '35%',
    backgroundColor: THEME.colors.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    ...THEME.shadows.medium,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  createBox: {
    backgroundColor: THEME.colors.primary,
  },
  optionContent: {
    flex: 1,
    marginRight: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.text.primary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: THEME.colors.text.secondary,
    lineHeight: 18,
  },
  infoBox: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 16,
  },
  infoText: {
    color: THEME.colors.primary,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
});

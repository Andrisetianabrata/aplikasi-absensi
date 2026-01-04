import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { THEME } from '../../theme/theme';
import { Zap } from 'lucide-react-native';

interface Props {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.primary} />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Zap size={40} color="#FFF" fill="#FFF" />
      </View>

      <Text style={styles.appName}>Volta</Text>

      <ActivityIndicator size="large" color="#FFF" style={styles.spinner} />

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 40,
    letterSpacing: 1,
  },
  spinner: {
    marginBottom: 20,
  },
  message: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
});

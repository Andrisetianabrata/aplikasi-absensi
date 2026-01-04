import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { apiClient } from '../../services/api/client';
import { useAuth } from '../../contexts/AuthContext';
import type { OnboardingScreenProps } from '../../types/navigation';

export function JoinBusinessScreen({ navigation }: OnboardingScreenProps<'JoinBusiness'>) {
  const [shortCode, setShortCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshProfile } = useAuth();

  const handleJoin = async () => {
    if (!shortCode.trim()) {
      Alert.alert('Error', 'Please enter the company code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/join-company', {
        short_code: shortCode.toUpperCase(),
      });

      if (response.data.success) {
        Alert.alert(
          'Request Submitted! 🎉',
          response.data.message || 'Waiting for company owner approval.',
          [{ text: 'OK', onPress: () => refreshProfile() }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Failed to Join',
        error.response?.data?.message || 'Invalid company code'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.iconEmoji}>🏢</Text>
      </View>

      <Text style={styles.title}>Join Company</Text>
      <Text style={styles.subtitle}>
        Enter the company code provided by your employer
      </Text>

      {/* Code Input */}
      <View style={styles.codeInputContainer}>
        <TextInput
          style={styles.codeInput}
          placeholder="ABC-12"
          placeholderTextColor="#64748B"
          value={shortCode}
          onChangeText={(text) => setShortCode(text.toUpperCase())}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={10}
        />
      </View>

      <Text style={styles.hintText}>
        💡 The code looks like: ABC-12 or XYZ-99
      </Text>

      {/* Join Button */}
      <TouchableOpacity
        style={[styles.joinButton, isLoading && styles.joinButtonDisabled]}
        onPress={handleJoin}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.joinButtonText}>
          {isLoading ? 'Joining...' : 'Join Company'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 24,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 24,
  },
  backButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '500',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  iconEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  codeInputContainer: {
    marginBottom: 16,
  },
  codeInput: {
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    fontSize: 28,
    color: '#F8FAFC',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 4,
  },
  hintText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 40,
  },
  joinButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 18,
    borderRadius: 14,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  joinButtonDisabled: {
    backgroundColor: '#334155',
    shadowOpacity: 0,
    elevation: 0,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

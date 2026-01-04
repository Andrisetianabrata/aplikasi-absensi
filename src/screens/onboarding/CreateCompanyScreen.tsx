import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { apiClient } from '../../services/api/client';
import { useAuth } from '../../contexts/AuthContext';
import type { OnboardingScreenProps } from '../../types/navigation';

export function CreateCompanyScreen({ navigation }: OnboardingScreenProps<'CreateCompany'>) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshProfile } = useAuth();

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter company name');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register-company', {
        name: name.trim(),
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
      });

      if (response.data.success) {
        const companyCode = response.data.data.company.short_code;
        Alert.alert(
          'Company Created! 🎉',
          `Your company code is: ${companyCode}\n\nShare this code with your employees.`,
          [{ text: 'Got it!', onPress: () => refreshProfile() }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Failed to Create',
        error.response?.data?.message || 'Please try again'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.iconEmoji}>🚀</Text>
      </View>

      <Text style={styles.title}>Register Company</Text>
      <Text style={styles.subtitle}>
        Set up attendance tracking for your team
      </Text>

      {/* Company Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Company Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Acme Corporation"
          placeholderTextColor="#64748B"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Address */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Address (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="123 Business Street"
          placeholderTextColor="#64748B"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      {/* Phone */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Phone (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="+62 812 3456 7890"
          placeholderTextColor="#64748B"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      {/* Create Button */}
      <TouchableOpacity
        style={[styles.createButton, isLoading && styles.createButtonDisabled]}
        onPress={handleCreate}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.createButtonText}>
          {isLoading ? 'Creating...' : 'Create Company'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.noteText}>
        📝 You can update work hours and other settings later
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
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
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#F8FAFC',
  },
  createButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 18,
    borderRadius: 14,
    marginTop: 16,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  createButtonDisabled: {
    backgroundColor: '#334155',
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  noteText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },
});

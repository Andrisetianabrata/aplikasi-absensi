import { useCallback, useState } from 'react';
import * as Location from 'expo-location';
import { Linking, Platform, Alert } from 'react-native';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

interface UseLocationService {
  isGpsEnabled: boolean;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<LocationData | null>;
  checkGpsStatus: () => Promise<boolean>;
  openLocationSettings: () => void;
}

export function useLocationService(): UseLocationService {
  const [isGpsEnabled, setIsGpsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openLocationSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }, []);

  const checkGpsStatus = useCallback(async (): Promise<boolean> => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      setIsGpsEnabled(enabled);
      setError(enabled ? null : 'GPS is disabled. Please enable location services.');
      return enabled;
    } catch (err) {
      setIsGpsEnabled(false);
      setError('Failed to check GPS status');
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
    setIsLoading(true);
    setError(null);

    // First check if GPS is enabled
    const gpsOk = await checkGpsStatus();
    if (!gpsOk) {
      setIsLoading(false);
      Alert.alert(
        'GPS Required',
        'Please enable GPS to mark your attendance.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openLocationSettings },
        ]
      );
      return null;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setIsLoading(false);
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to get location');
      return null;
    }
  }, [checkGpsStatus, openLocationSettings]);

  return {
    isGpsEnabled,
    isLoading,
    error,
    getCurrentLocation,
    checkGpsStatus,
    openLocationSettings,
  };
}

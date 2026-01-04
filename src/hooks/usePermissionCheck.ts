import { useState, useEffect, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import { useCameraPermissions, PermissionStatus } from 'expo-camera';
import * as Location from 'expo-location';
import type { PermissionState, PermissionCheckResult } from '../types/permissions';

export function usePermissionCheck(): PermissionCheckResult {
  const [status, setStatus] = useState<PermissionState>('loading');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationStatus, setLocationStatus] = useState<Location.PermissionStatus | null>(null);
  const [isGpsEnabled, setIsGpsEnabled] = useState(false);

  const checkAllPermissions = useCallback(async () => {
    try {
      // Camera permission is handled by the hook, we only need to check Location
      const locationPermission = await Location.getForegroundPermissionsAsync();
      setLocationStatus(locationPermission.status);

      // We need to wait for camera permission hook to initialize
      if (!cameraPermission) return;

      if (cameraPermission.granted && locationPermission.granted) {
        setStatus('granted');
      } else if (!cameraPermission.canAskAgain || !locationPermission.canAskAgain) {
        setStatus('blocked');
      } else {
        setStatus('denied');
      }
    } catch (error) {
      console.error('Permission check failed:', error);
      setStatus('denied');
    }
  }, [cameraPermission]);

  const requestPermissions = useCallback(async () => {
    setStatus('loading');
    try {
      // Request both permissions
      const cameraResult = await requestCameraPermission();
      const locationResult = await Location.requestForegroundPermissionsAsync();

      setLocationStatus(locationResult.status);

      if (cameraResult.granted && locationResult.granted) {
        setStatus('granted');
      } else if (!cameraResult.canAskAgain || !locationResult.canAskAgain) {
        setStatus('blocked');
      } else {
        setStatus('denied');
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      setStatus('denied');
    }
  }, [requestCameraPermission]);

  const checkGpsStatus = useCallback(async (): Promise<boolean> => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      setIsGpsEnabled(enabled);
      return enabled;
    } catch (error) {
      setIsGpsEnabled(false);
      return false;
    }
  }, []);

  const openAppSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }, []);

  // Update status when camera permission changes (from hook)
  useEffect(() => {
    checkAllPermissions();
  }, [checkAllPermissions, cameraPermission]);

  // Check GPS status when permissions are granted
  useEffect(() => {
    if (status === 'granted') {
      checkGpsStatus();
    }
  }, [status, checkGpsStatus]);

  return {
    status,
    cameraStatus: cameraPermission?.status || PermissionStatus.UNDETERMINED,
    locationStatus,
    requestPermissions,
    openAppSettings,
    isGpsEnabled,
    checkGpsStatus,
    refresh: checkAllPermissions,
  };
}

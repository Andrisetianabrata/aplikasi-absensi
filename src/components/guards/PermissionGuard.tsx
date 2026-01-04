import React from 'react';
import { usePermissionCheck } from '../../hooks/usePermissionCheck';
import { PermissionRequestScreen } from '../screens/PermissionRequestScreen';
import { SettingsRequiredScreen } from '../screens/SettingsRequiredScreen';
import { LoadingScreen } from '../screens/LoadingScreen';

interface PermissionGuardProps {
  children: React.ReactNode;
}

/**
 * PermissionGuard - Wraps the entire app to enforce Camera and Location permissions.
 * 
 * CRITICAL: The app is completely BLOCKED if permissions are not granted.
 * This is intentional as the app relies 100% on Camera (Face Rec) and Location (Geofencing).
 */
export function PermissionGuard({ children }: PermissionGuardProps) {
  const {
    status,
    requestPermissions,
    openAppSettings,
    refresh,
  } = usePermissionCheck();

  switch (status) {
    case 'loading':
      return <LoadingScreen message="Checking permissions..." />;

    case 'denied':
      return (
        <PermissionRequestScreen
          onRequest={requestPermissions}
          title="Permissions Required"
          description="Volta needs Camera and Location access to verify your identity and mark attendance at your workplace."
          reasons={[
            { icon: 'camera', text: 'Camera for face recognition to verify it\'s you' },
            { icon: 'map-marker', text: 'Location to confirm you\'re at your workplace' },
          ]}
        />
      );

    case 'blocked':
      return (
        <SettingsRequiredScreen
          onOpenSettings={openAppSettings}
          onRetry={refresh}
          title="Settings Required"
          description="You've previously denied permissions. Please enable Camera and Location in your device settings to use Volta."
        />
      );

    case 'granted':
      return <>{children}</>;

    default:
      return <LoadingScreen />;
  }
}

// Types for permission state management
import { PermissionStatus } from 'react-native-permissions';

export type PermissionState = 'loading' | 'granted' | 'denied' | 'blocked';

export interface PermissionCheckResult {
  status: PermissionState;
  cameraStatus: PermissionStatus | null;
  locationStatus: PermissionStatus | null;
  requestPermissions: () => Promise<void>;
  openAppSettings: () => void;
  isGpsEnabled: boolean;
  checkGpsStatus: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

export interface PermissionReason {
  icon: string;
  text: string;
}

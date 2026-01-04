import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFaceRecognition } from '../../hooks/useFaceRecognition';
import { useLocationService } from '../../hooks/useLocationService';
import { apiClient } from '../../services/api/client';
import { useAuth } from '../../contexts/AuthContext';
import type { AppStackScreenProps } from '../../types/navigation';

/**
 * NOTE: In a production app, you would use a face detection/embedding model.
 * This implementation shows the integration pattern with mock embeddings.
 */

export function AttendanceCameraScreen({ route, navigation }: AppStackScreenProps<'AttendanceCamera'>) {
  const { mode } = route.params;
  const { companies } = useAuth();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [isCapturing, setIsCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  const { verifyFace, registerFace, hasRegisteredFace, loadStoredEmbedding } = useFaceRecognition();
  const { getCurrentLocation, isGpsEnabled, checkGpsStatus } = useLocationService();

  const employeeId = companies[0]?.employee_id;

  useEffect(() => {
    checkGpsStatus();
    loadStoredEmbedding();
  }, []);

  /**
   * Mock embedding extraction
   * In production: Use a face detection library to extract embedding
   */
  const extractEmbedding = async (): Promise<number[]> => {
    // Simulate processing time
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

    // Generate mock embedding (in real app, this comes from ML model)
    const embedding: number[] = [];
    for (let i = 0; i < 512; i++) {
      embedding.push(Math.random() * 2 - 1);
    }
    return embedding;
  };

  const handleCapture = useCallback(async () => {
    if (!employeeId) {
      Alert.alert('Error', 'Employee ID not found');
      return;
    }

    setIsCapturing(true);

    try {
      // Step 1: Verify GPS is enabled
      const gpsOk = await checkGpsStatus();
      if (!gpsOk) {
        Alert.alert('GPS Required', 'Please enable GPS to mark attendance.');
        setIsCapturing(false);
        return;
      }

      // Step 2: Extract face embedding
      const embedding = await extractEmbedding();

      // Step 3: Verify or register face
      if (hasRegisteredFace) {
        const result = verifyFace(embedding);
        if (!result.success) {
          Alert.alert(
            'Face Not Matched',
            `Verification failed. Please try again.\nConfidence: ${(1 - result.score).toFixed(2)}`
          );
          setIsCapturing(false);
          return;
        }
      } else {
        // First time - register face
        await registerFace(embedding);
      }

      // Step 4: Get current location
      const location = await getCurrentLocation();
      if (!location) {
        Alert.alert('Location Error', 'Could not get your current location.');
        setIsCapturing(false);
        return;
      }

      // Step 5: Submit attendance (NO raw image sent!)
      const endpoint = mode === 'check-in' ? '/attendance/check-in' : '/attendance/check-out';
      const response = await apiClient.post(endpoint, {
        employee_id: employeeId,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      if (response.data.success) {
        Alert.alert(
          mode === 'check-in' ? 'Checked In! ✓' : 'Checked Out! ✓',
          response.data.message,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to mark attendance'
      );
    } finally {
      setIsCapturing(false);
    }
  }, [employeeId, mode, hasRegisteredFace, verifyFace, registerFace, getCurrentLocation, checkGpsStatus, navigation]);

  if (!permission) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Camera permission required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Camera */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {/* Mode Indicator */}
        <View style={[styles.modeIndicator, mode === 'check-in' ? styles.modeCheckIn : styles.modeCheckOut]}>
          <Text style={styles.modeText}>
            {mode === 'check-in' ? '☀️ Check In' : '🌙 Check Out'}
          </Text>
        </View>

        {/* Face Outline */}
        <View style={styles.faceOutlineContainer}>
          <View style={[styles.faceOutline, faceDetected && styles.faceOutlineDetected]} />
          <Text style={styles.faceHint}>Position your face in the frame</Text>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {/* GPS Status */}
          <View style={[styles.statusBadge, isGpsEnabled ? styles.statusOk : styles.statusWarning]}>
            <Text style={styles.statusText}>
              {isGpsEnabled ? '📍 GPS Ready' : '📍 GPS Disabled'}
            </Text>
          </View>

          {/* Registration Notice */}
          {!hasRegisteredFace && (
            <View style={styles.registrationNotice}>
              <Text style={styles.registrationText}>
                👋 First time? Your face will be registered for future verification.
              </Text>
            </View>
          )}

          {/* Capture Button */}
          <TouchableOpacity
            style={[styles.captureButton, (!isGpsEnabled || isCapturing) && styles.captureButtonDisabled]}
            onPress={handleCapture}
            disabled={!isGpsEnabled || isCapturing}
            activeOpacity={0.8}
          >
            <View style={styles.captureButtonInner}>
              <Text style={styles.captureButtonText}>
                {isCapturing ? '⏳' : '📷'}
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.captureHint}>
            {isCapturing ? 'Processing...' : 'Tap to capture'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  modeIndicator: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: -30,
  },
  modeCheckIn: {
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
  },
  modeCheckOut: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  modeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  faceOutlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceOutline: {
    width: 250,
    height: 320,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
  },
  faceOutlineDetected: {
    borderColor: '#22C55E',
    borderStyle: 'solid',
  },
  faceHint: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 16,
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusOk: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  registrationNotice: {
    backgroundColor: 'rgba(79, 70, 229, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20,
    maxWidth: 300,
  },
  registrationText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  captureButtonDisabled: {
    backgroundColor: '#334155',
    shadowOpacity: 0,
    elevation: 0,
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    fontSize: 28,
  },
  captureHint: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 12,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

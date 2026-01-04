import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useFaceRecognition } from '../../hooks/useFaceRecognition';
import { THEME } from '../../theme/theme';
import { ScanFace, Camera as CameraIcon, AlertTriangle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function FaceRegistrationScreen({ navigation }: any) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraType, setCameraType] = useState(CameraType.front);
  const { registerFace, isProcessing } = useFaceRecognition();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleFaceDetected = async ({ faces }: any) => {
    if (faces.length > 0 && !isProcessing) {
      // Logic for face detection - simplified for now
      // In a real implementation, you'd capture the frame and process it
      // For now, we'll simulate a manual capture button to trigger "registration"
    }
  };

  const handleRegister = async () => {
    // Mock registration for now, as useFaceRecognition hooks expects logic
    // connecting to frame processing which depends on specific face library integration
    // We will assume the user clicks "Register" when their face is in view

    // In a real app, you'd take a snapshot, generate embedding, and save it.
    Alert.alert("Registration Simulated", "Face registered successfully!");
    // You would then call registerFace(embedding) here
    // And navigate back or to the main app
    navigation.replace('App');
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={cameraType}
      // onFacesDetected={handleFaceDetected} // Uncomment if face detection is enabled
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.title}>Face Registration</Text>
            <Text style={styles.subtitle}>Please align your face within the frame</Text>
          </View>

          <View style={styles.frameContainer}>
            <ScanFace size={300} color={THEME.colors.primary} strokeWidth={1} style={{ opacity: 0.8 }} />
          </View>

          <View style={styles.controls}>
            <View style={styles.infoCard}>
              <AlertTriangle size={20} color={THEME.colors.status.warning} />
              <Text style={styles.infoText}>Make sure you are in a well-lit area.</Text>
            </View>

            <TouchableOpacity style={styles.captureButton} onPress={handleRegister}>
              <CameraIcon size={24} color="#FFF" />
              <Text style={styles.captureText}>Register Face</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME.spacing.l,
  },
  header: {
    alignItems: 'center',
    marginTop: THEME.spacing.m,
  },
  title: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: THEME.spacing.xs,
  },
  subtitle: {
    fontSize: THEME.fonts.sizes.m,
    color: 'rgba(255,255,255,0.8)',
  },
  frameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    width: '100%',
    alignItems: 'center',
    gap: THEME.spacing.m,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: THEME.spacing.m,
    borderRadius: 12,
    gap: THEME.spacing.s,
  },
  infoText: {
    color: '#FFF',
    fontSize: THEME.fonts.sizes.s,
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.m,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: 30,
    gap: THEME.spacing.s,
  },
  captureText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: THEME.fonts.sizes.m,
  },
  text: {
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: THEME.colors.primary,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

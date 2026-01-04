import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView } from 'react-native';

type SnackbarType = 'success' | 'error' | 'info';

interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

interface SnackbarProviderProps {
  children: ReactNode;
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<SnackbarType>('info');

  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSnackbar = useCallback((msg: string, msgType: SnackbarType = 'info') => {
    setMessage(msg);
    setType(msgType);
    setVisible(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto dismiss after 3 seconds
    timeoutRef.current = setTimeout(() => {
      hideSnackbar();
    }, 4000); // 4 seconds
  }, []);

  const hideSnackbar = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#22C55E'; // Green
      case 'error': return '#EF4444'; // Red
      case 'info': return '#3B82F6'; // Blue
      default: return '#1E293B';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'info': return 'ℹ';
      default: return '';
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {visible && (
        <SafeAreaView pointerEvents="none" style={styles.container}>
          <Animated.View
            style={[
              styles.snackbar,
              { backgroundColor: getBackgroundColor(), opacity }
            ]}
          >
            <Text style={styles.icon}>{getIcon()}</Text>
            <Text style={styles.message}>{message}</Text>
          </Animated.View>
        </SafeAreaView>
      )}
    </SnackbarContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50, // Top positioning often looks better for alerts
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  snackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    minWidth: '80%',
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginRight: 10,
    fontWeight: 'bold',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
});

// Type definitions for react-native-vector-icons
declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { Component } from 'react';
  import { TextStyle, ViewStyle } from 'react-native';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle;
  }

  export default class Icon extends Component<IconProps> { }
}

// Type definitions for react-native-fast-tflite
declare module 'react-native-fast-tflite' {
  interface TFLiteOptions {
    model: any;
    delegate?: 'default' | 'metal' | 'nnapi' | 'gpu';
  }

  interface TFLite {
    runSync(inputs: any[]): Float32Array[];
    runAsync(inputs: any[]): Promise<Float32Array[]>;
    close(): void;
  }

  export function useTFLite(options: TFLiteOptions): TFLite | null;
}

// Type definitions for react-native-worklets-core
declare module 'react-native-worklets-core' {
  export function useRunOnJS<T extends (...args: any[]) => any>(
    fn: T,
    deps: any[]
  ): (...args: Parameters<T>) => void;

  export function useSharedValue<T>(initialValue: T): { value: T };
}

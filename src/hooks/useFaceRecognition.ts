import { useCallback, useState, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import { euclideanDistance, SIMILARITY_THRESHOLD, normalizeEmbedding } from '../utils/faceEmbedding';

const EMBEDDING_KEY = 'face_embedding';

interface FaceVerifyResult {
  success: boolean;
  score: number;
  isNewUser: boolean;
}

interface UseFaceRecognition {
  isProcessing: boolean;
  matchScore: number | null;
  isMatch: boolean;
  storedEmbedding: number[] | null;
  verifyFace: (embedding: number[]) => FaceVerifyResult;
  registerFace: (embedding: number[]) => Promise<void>;
  clearFace: () => Promise<void>;
  hasRegisteredFace: boolean;
  loadStoredEmbedding: () => Promise<number[] | null>;
}

/**
 * Face Recognition Hook
 * 
 * Manages face embedding storage and verification.
 * Uses Euclidean distance with threshold of 0.6 for matching.
 * 
 * SECURITY: Raw images are NEVER stored or sent to server.
 * Only 512-dimension embeddings are used.
 */
export function useFaceRecognition(): UseFaceRecognition {
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [isMatch, setIsMatch] = useState(false);
  const [storedEmbedding, setStoredEmbedding] = useState<number[] | null>(null);
  const lastEmbeddingRef = useRef<number[] | null>(null);

  // Load stored embedding
  const loadStoredEmbedding = useCallback(async (): Promise<number[] | null> => {
    const stored = await SecureStore.getItemAsync(EMBEDDING_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStoredEmbedding(parsed);
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  const hasRegisteredFace = !!storedEmbedding;

  /**
   * Verify a face embedding against stored embedding
   */
  const verifyFace = useCallback((embedding: number[]): FaceVerifyResult => {
    setIsProcessing(true);

    // If no stored embedding, this is a new user
    if (!storedEmbedding) {
      setIsProcessing(false);
      return {
        success: false,
        score: 1,
        isNewUser: true,
      };
    }

    // Normalize embeddings before comparison
    const normalizedInput = normalizeEmbedding(embedding);
    const normalizedStored = normalizeEmbedding(storedEmbedding);

    // Calculate distance
    const distance = euclideanDistance(normalizedInput, normalizedStored);
    const isMatched = distance < SIMILARITY_THRESHOLD;

    setMatchScore(distance);
    setIsMatch(isMatched);
    lastEmbeddingRef.current = embedding;
    setIsProcessing(false);

    return {
      success: isMatched,
      score: distance,
      isNewUser: false,
    };
  }, [storedEmbedding]);

  /**
   * Register a new face embedding
   */
  const registerFace = useCallback(async (embedding: number[]) => {
    const normalized = normalizeEmbedding(embedding);
    await SecureStore.setItemAsync(EMBEDDING_KEY, JSON.stringify(normalized));
    setStoredEmbedding(normalized);
    lastEmbeddingRef.current = normalized;
  }, []);

  /**
   * Clear stored face embedding
   */
  const clearFace = useCallback(async () => {
    await SecureStore.deleteItemAsync(EMBEDDING_KEY);
    setStoredEmbedding(null);
    lastEmbeddingRef.current = null;
    setMatchScore(null);
    setIsMatch(false);
  }, []);

  return {
    isProcessing,
    matchScore,
    isMatch,
    storedEmbedding,
    verifyFace,
    registerFace,
    clearFace,
    hasRegisteredFace,
    loadStoredEmbedding,
  };
}

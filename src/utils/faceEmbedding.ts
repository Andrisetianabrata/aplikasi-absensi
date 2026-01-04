/**
 * Face Embedding Utilities
 * 
 * Calculate Euclidean distance between face embeddings
 * Threshold: < 0.6 = same person
 */

export const SIMILARITY_THRESHOLD = 0.6;
export const EMBEDDING_SIZE = 512;

/**
 * Calculate Euclidean distance between two face embedding vectors
 */
export function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embedding vectors must have the same length');
  }

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2);
  }
  return Math.sqrt(sum);
}

/**
 * Check if two embeddings are from the same person
 */
export function isSamePerson(
  embedding1: number[],
  embedding2: number[],
  threshold: number = SIMILARITY_THRESHOLD
): boolean {
  const distance = euclideanDistance(embedding1, embedding2);
  return distance < threshold;
}

/**
 * Normalize embedding vector (L2 normalization)
 */
export function normalizeEmbedding(embedding: number[]): number[] {
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map((val) => val / norm);
}

/**
 * Cosine similarity between two vectors (alternative to Euclidean)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

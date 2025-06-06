import { useState, useEffect, useCallback } from 'react';
import * as toxicity from '@tensorflow-models/toxicity';

const TOXICITY_THRESHOLD = 0.8;
let modelInstance: toxicity.ToxicityClassifier | null = null;

// Cache model globally to avoid reloading
export const useToxicityDetection = () => {
  const [isLoading, setIsLoading] = useState(!modelInstance);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (modelInstance) return;

    const loadModel = async () => {
      try {
        // Load model in background
        modelInstance = await toxicity.load(
          TOXICITY_THRESHOLD, 
          ['toxicity', 'severe_toxicity', 'identity_attack', 'insult', 'threat'],
          { useWorker: true } // Use Web Worker for non-blocking load
        );
      } catch (err) {
        setError('Failed to load toxicity model');
        console.error('Error loading toxicity model:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, []);

  const analyzeText = useCallback(async (text: string): Promise<{
    isToxic: boolean;
    scores: {
      toxicity: number;
      severe_toxicity: number;
      identity_attack: number;
      insult: number;
      threat: number;
    };
  }> => {
    if (!modelInstance) {
      // Return safe default if model isn't loaded
      return {
        isToxic: false,
        scores: {
          toxicity: 0,
          severe_toxicity: 0,
          identity_attack: 0,
          insult: 0,
          threat: 0
        }
      };
    }

    const predictions = await modelInstance.classify(text);
    
    const scores = {
      toxicity: predictions[0].results[0].probabilities[1],
      severe_toxicity: predictions[1].results[0].probabilities[1],
      identity_attack: predictions[2].results[0].probabilities[1],
      insult: predictions[3].results[0].probabilities[1],
      threat: predictions[4].results[0].probabilities[1]
    };

    const isToxic = predictions.some(p => p.results[0].match);

    return { isToxic, scores };
  }, []);

  return { analyzeText, isLoading, error };
};
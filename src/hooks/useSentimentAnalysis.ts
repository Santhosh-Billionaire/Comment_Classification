import { useCallback } from 'react';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();
const TOXICITY_THRESHOLD = -2;

export const useSentimentAnalysis = () => {
  const analyzeText = useCallback((text: string): {
    isToxic: boolean;
    scores: {
      score: number;
      comparative: number;
      negative: string[];
      positive: string[];
    };
  } => {
    const analysis = sentiment.analyze(text);
    
    return {
      isToxic: analysis.score < TOXICITY_THRESHOLD,
      scores: {
        score: analysis.score,
        comparative: analysis.comparative,
        negative: analysis.negative,
        positive: analysis.positive
      }
    };
  }, []);

  return { analyzeText };
};
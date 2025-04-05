/**
 * NOTE: This is a mock implementation to demonstrate the concept.
 * In a real application, this would connect to actual ML models
 * deployed on a server or utilize TensorFlow.js for client-side inference.
 */

/**
 * Types for ML predictions
 */
export interface PricePrediction {
  currentPrice: number; // INR
  predictedPrice: number; // INR
  confidence: number; // 0-1
  trend: 'increase' | 'decrease' | 'stable';
  factors: string[];
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // -1 to 1
  keywords: string[];
  topics: Array<{topic: string, relevance: number}>;
}

/**
 * Mock function to predict the price of civic services or materials
 * In a real implementation, this would use a BERT+LSTM model
 * @param itemDescription Description of the item or service to predict
 * @param category Category of the item (e.g., construction, digital)
 * @param region Geographic region within India
 * @returns Price prediction with confidence
 */
export const predictPrice = async (
  itemDescription: string,
  category: string,
  region: string
): Promise<PricePrediction> => {
  console.log(`Predicting price for: ${itemDescription} (${category}) in ${region}`);
  
  // Mock implementation - in reality this would call an API endpoint
  // that runs inference on our BERT+LSTM model
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a somewhat realistic but mock prediction
  const basePrice = Math.round(10000 + Math.random() * 50000); // Random base price between 10K-60K INR
  const randomFactor = 0.85 + Math.random() * 0.3; // Random factor between 0.85-1.15
  const predictedPrice = Math.round(basePrice * randomFactor);
  
  // Determine trend based on prediction vs current
  let trend: 'increase' | 'decrease' | 'stable';
  if (predictedPrice > basePrice * 1.05) {
    trend = 'increase';
  } else if (predictedPrice < basePrice * 0.95) {
    trend = 'decrease';
  } else {
    trend = 'stable';
  }
  
  // Generate mock factors for the prediction
  const allFactors = [
    'Seasonal demand variations',
    'Recent policy changes',
    'Supply chain disruptions',
    'Local market competition',
    'Labor cost fluctuations',
    'Raw material price changes',
    'Transportation cost impact',
    'Inflation trends',
    'Regional development plans'
  ];
  
  // Randomly select 2-4 factors
  const numFactors = 2 + Math.floor(Math.random() * 3);
  const shuffled = [...allFactors].sort(() => 0.5 - Math.random());
  const factors = shuffled.slice(0, numFactors);
  
  return {
    currentPrice: basePrice,
    predictedPrice,
    confidence: 0.7 + Math.random() * 0.25, // Random confidence between 0.7-0.95
    trend,
    factors
  };
};

/**
 * Mock function to analyze sentiment in civic feedback
 * In a real implementation, this would use NLP models
 * @param text The text to analyze for sentiment
 * @returns Sentiment analysis results
 */
export const analyzeSentiment = async (text: string): Promise<SentimentAnalysis> => {
  console.log(`Analyzing sentiment for text: ${text}`);
  
  // Mock implementation - in reality this would call an API endpoint
  // that runs the NLP sentiment analysis
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simple keyword-based sentiment analysis for the mock
  const positiveWords = ['good', 'great', 'excellent', 'happy', 'satisfied', 'improve', 'clean', 'efficient'];
  const negativeWords = ['bad', 'poor', 'terrible', 'sad', 'disappointed', 'delay', 'dirty', 'problem'];
  
  const textLower = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  // Count positive and negative words
  positiveWords.forEach(word => {
    if (textLower.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (textLower.includes(word)) negativeCount++;
  });
  
  // Calculate sentiment score (-1 to 1)
  const totalSentimentWords = positiveCount + negativeCount;
  let score = 0;
  
  if (totalSentimentWords > 0) {
    score = (positiveCount - negativeCount) / totalSentimentWords;
  }
  
  // Determine overall sentiment
  let sentiment: 'positive' | 'negative' | 'neutral';
  if (score > 0.2) {
    sentiment = 'positive';
  } else if (score < -0.2) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  // Extract keywords from text
  const words = textLower.split(/\W+/).filter(w => w.length > 3);
  const uniqueWords = Array.from(new Set(words));
  const keywords = uniqueWords.slice(0, Math.min(5, uniqueWords.length));
  
  // Generate mock topics
  const possibleTopics = [
    'Infrastructure', 'Sanitation', 'Public Transport',
    'Education', 'Healthcare', 'Safety', 'Environment',
    'Digital Services', 'Governance', 'Community Engagement'
  ];
  
  const numTopics = 1 + Math.floor(Math.random() * 3);
  const shuffled = [...possibleTopics].sort(() => 0.5 - Math.random());
  const topics = shuffled.slice(0, numTopics).map(topic => ({
    topic,
    relevance: 0.6 + Math.random() * 0.4 // Random relevance between 0.6-1.0
  }));
  
  return {
    sentiment,
    score,
    keywords,
    topics
  };
};

/**
 * Mock function to recommend relevant civic actions based on user profile
 * @param userInterests Array of user interest categories
 * @param userLocation User's general location
 * @param pastActivities Array of past activity IDs
 * @returns Array of recommended activity IDs
 */
export const getRecommendations = async (
  userInterests: string[],
  userLocation: string,
  pastActivities: number[]
): Promise<number[]> => {
  // In a real implementation, this would use a recommendation engine
  // based on collaborative filtering or content-based approaches
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Mock implementation - return random IDs for now
  const recommendations = [];
  const numRecommendations = 3 + Math.floor(Math.random() * 5); // 3-7 recommendations
  
  for (let i = 0; i < numRecommendations; i++) {
    // Generate random IDs that are not in pastActivities
    let newId;
    do {
      newId = 1 + Math.floor(Math.random() * 100);
    } while (pastActivities.includes(newId) || recommendations.includes(newId));
    
    recommendations.push(newId);
  }
  
  return recommendations;
}; 
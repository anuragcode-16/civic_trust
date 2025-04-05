import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Gemini API endpoint and model
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Add export config to specify that this is NOT an edge function
export const runtime = 'nodejs';

/**
 * Mock Gemini API handler
 * In a production environment, this would call the actual Gemini API
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { prompt, location, issue, category } = data;
    
    // Generate deterministic but varied responses
    const insights = generateInsights(prompt, location, issue, category);
    
    // Simulate API delay (300-800ms)
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    
    return NextResponse.json({
      success: true,
      insights,
      source: 'gemini-mock',
      meta: {
        model: 'gemini-pro',
        prompt,
        location: location ? `${location.lat.toFixed(4)},${location.lng.toFixed(4)}` : undefined,
        issue,
        category
      }
    });
  } catch (error) {
    console.error('Error in Gemini API route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate insights',
        source: 'gemini-mock-error'
      },
      { status: 500 }
    );
  }
}

/**
 * Generate mock insights based on the input parameters
 */
function generateInsights(
  prompt: string,
  location?: { lat: number, lng: number },
  issue?: string,
  category?: string
): string[] {
  // Create a hash from the inputs to generate deterministic responses
  const inputString = `${prompt}-${location?.lat || 0}-${location?.lng || 0}-${issue || ''}-${category || ''}`;
  const hash = Array.from(inputString).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Various templates for insights
  const generalInsights = [
    "Analysis of recent data shows a 23% increase in community engagement when issues are visibly tracked.",
    "Communities with active civic participation tend to resolve issues 2.5x faster than those with low engagement.",
    "Data suggests that transparent communication about local issues increases resident satisfaction by up to 40%.",
    "Local government responsiveness improved by 28% in areas with higher digital civic engagement.",
    "Our AI analysis identifies strong correlations between rapid issue resolution and increased community trust.",
    "Similar communities have found success by implementing regular town halls focused on priority issues.",
    "Digital tracking of community issues has led to 37% more efficient resource allocation in comparable areas.",
    "The most successful civic initiatives combine digital reporting with in-person community action days.",
    "Gamification of civic participation has shown promising results in motivating younger residents to engage.",
    "Communities that celebrate issue resolution see 34% higher participation rates in future initiatives."
  ];
  
  const categorySpecificInsights: Record<string, string[]> = {
    "Infrastructure": [
      "Infrastructure issues constitute approximately 43% of all reported concerns in similar communities.",
      "Successful infrastructure projects typically require 20% more community input during planning phases.",
      "Preventative maintenance programs have reduced critical infrastructure issues by 35% in comparable areas.",
      "Partnerships between local businesses and government have accelerated infrastructure improvements by 40%.",
      "Communities prioritizing infrastructure see increased property values of 7-12% over five years."
    ],
    "Safety": [
      "Safety concerns are reported 2.1x more frequently in areas with limited community policing programs.",
      "Communities with neighborhood watch programs report 31% fewer safety incidents on average.",
      "Strategic lighting improvements have reduced nighttime incidents by 26% in similar neighborhoods.",
      "Safety perception improves by 45% when residents receive regular updates on resolved issues.",
      "Community-based safety initiatives show 37% higher success rates than top-down approaches."
    ],
    "Environment": [
      "Environmental initiatives see the highest volunteer participation rates among all community projects.",
      "Local green spaces increase nearby community engagement by 28% on average.",
      "Community-led environmental projects have 3.2x the sustainability rate of government-only initiatives.",
      "Areas with strong environmental programs show 22% higher resident retention over five years.",
      "Environmental issues with visual documentation receive 40% more community support for resolution."
    ],
    "Vandalism": [
      "Communities addressing vandalism through art programs see 47% reduction in repeat incidents.",
      "Rapid response to vandalism (within 72 hours) reduces subsequent incidents by 35%.",
      "Areas with youth engagement programs report 42% fewer vandalism issues annually.",
      "Community-designed spaces experience 58% less vandalism than standard municipal designs.",
      "Vandalism reporting systems coupled with visible restoration efforts improve community satisfaction by 33%."
    ]
  };
  
  const locationBasedInsights = location ? [
    `The area around ${location.lat.toFixed(3)}, ${location.lng.toFixed(3)} shows ${hash % 30 + 10}% higher civic engagement than the regional average.`,
    `Similar geographic communities have successfully implemented participatory budgeting with ${hash % 20 + 65}% approval rates.`,
    `Local analysis suggests focusing resources on ${hash % 2 === 0 ? 'weekday evenings' : 'weekend mornings'} would improve community participation by ${hash % 15 + 20}%.`,
    `Civic projects within 2km of this location have historically seen ${hash % 25 + 60}% completion rates.`,
    `Communities in similar geographic settings have reduced issue resolution time by ${hash % 10 + 25}% through mobile reporting tools.`
  ] : [];
  
  // Get category-specific insights if available
  const categoryInsights = category && categorySpecificInsights[category] 
    ? categorySpecificInsights[category] 
    : [];
  
  // Issue-specific insights
  const issueInsights = issue ? [
    `Issues similar to "${issue}" have been successfully resolved in ${hash % 12 + 4} weeks on average.`,
    `Community feedback indicates that "${issue}" type concerns benefit from ${hash % 2 === 0 ? 'public-private partnerships' : 'volunteer task forces'}.`,
    `Data from comparable communities suggests addressing "${issue}" would improve resident satisfaction by ${hash % 15 + 20}%.`,
    `Historical patterns indicate that "${issue}" tends to recur if not addressed with sustainable long-term planning.`,
    `Analysis of similar issues shows ${hash % 30 + 50}% of residents consider this a priority concern.`
  ] : [];
  
  // Pool all relevant insights
  const allInsights = [
    ...generalInsights,
    ...categoryInsights,
    ...locationBasedInsights,
    ...issueInsights
  ];
  
  // Shuffle based on hash
  const shuffledInsights = [...allInsights].sort(() => (hash % 10) - 5);
  
  // Select 3-5 insights based on hash
  const numInsights = 3 + (hash % 3);
  return shuffledInsights.slice(0, numInsights);
}

// Generate simulated AI insights based on input parameters
function simulateGeminiInsights(
  prompt: string, 
  location?: { lat: number, lng: number }, 
  issue?: string,
  category?: string
): string[] {
  // Default insights if minimal information is provided
  if (!location && !issue) {
    return [
      "Based on available data, civic engagement in this area has increased by 23% in the last quarter.",
      "Community members tend to prioritize infrastructure and safety issues over other categories.",
      "Local resolution time for reported issues averages 18 days, which is better than the national average of 24 days."
    ];
  }
  
  // Location-specific insights
  if (location && !issue) {
    // Deterministic "randomness" based on coordinates
    const locationSeed = Math.abs(Math.sin(location.lat * location.lng) * 100);
    const participationRate = Math.floor(locationSeed % 30) + 60; // 60-90%
    const growthRate = Math.floor(locationSeed % 20) + 10; // 10-30%
    const resolveTime = Math.floor(locationSeed % 15) + 8; // 8-23 days
    
    return [
      `This area has a civic participation rate of ${participationRate}%, which is ${participationRate > 75 ? 'above' : 'near'} the regional average.`,
      `Community engagement in this location has grown by approximately ${growthRate}% in the past 6 months.`,
      `The average time to resolve civic issues in this neighborhood is ${resolveTime} days, trending ${resolveTime < 15 ? 'better' : 'similar to'} nearby communities.`,
      "Analysis suggests focusing on building more collaborative initiatives between residents and local authorities."
    ];
  }
  
  // Issue-specific insights
  if (issue) {
    // Generate insights based on issue category
    const categorySeed = category ? 
      category.toLowerCase().charCodeAt(0) : 
      Math.floor(Math.random() * 4);
    
    const categoryInsights = {
      'infrastructure': [
        "Similar infrastructure issues in this area are typically resolved within 2-3 weeks.",
        "Historical data shows infrastructure improvements lead to 15-20% increase in property values.",
        "Community participation tends to expedite resolution of infrastructure issues by 30%."
      ],
      'safety': [
        "Safety concerns like this one have been increasing in frequency by 12% year-over-year.",
        "Community alert systems have proven effective for similar safety issues in comparable neighborhoods.",
        "Data shows a correlation between resolved safety issues and increased pedestrian activity."
      ],
      'environment': [
        "Environmental issues in this area have decreased by 18% since community cleanup initiatives began.",
        "Similar environmental concerns typically require cooperation from multiple local agencies.",
        "Community gardens and green spaces increase local environmental awareness by approximately 40%."
      ],
      'vandalism': [
        "Areas with active neighborhood watch programs show 35% less recurring vandalism incidents.",
        "Community art programs have successfully reduced vandalism in similar locations by 27%.",
        "Rapid response to vandalism issues like this decreases likelihood of repeat incidents."
      ]
    };
    
    // Select the appropriate category or default
    let selectedCategory = 'infrastructure';
    if (category) {
      const lowerCategory = category.toLowerCase();
      if (lowerCategory in categoryInsights) {
        selectedCategory = lowerCategory;
      }
    }
    
    // Return insights with a general one first
    return [
      `This ${selectedCategory} issue has been reported ${categorySeed % 2 === 0 ? 'more frequently' : 'at similar rates'} compared to neighboring communities.`,
      ...categoryInsights[selectedCategory as keyof typeof categoryInsights]
    ];
  }
  
  // Default fallback insights
  return [
    "Community engagement tends to be strongest when issues directly impact daily life.",
    "Data suggests that transparent communication about issue resolution increases trust by 45%.",
    "Collaborative approaches between citizens and local authorities reduce resolution time by 27% on average."
  ];
} 
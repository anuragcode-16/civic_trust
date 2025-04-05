import { NextRequest, NextResponse } from 'next/server';
import { getStatistics } from '@/app/lib/db';
import { authenticateRequest } from '@/app/lib/auth';
import clientPromise from '../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Optional authentication check
    const user = await authenticateRequest(request);
    
    // Get statistics from the database
    const statistics = await getStatistics();
    
    // Add additional calculated metrics
    const enhancedStatistics = {
      ...statistics,
      
      // Include user-specific data if authenticated
      user: user ? {
        isAdmin: user.role === 'admin',
        // Add more user-specific statistics if needed
      } : null,
      
      // Add timestamp
      timestamp: new Date().toISOString(),
      
      // Additional calculated metrics
      projectCompletionRate: statistics.totalProjects > 0 
        ? ((statistics.activeProjects / statistics.totalProjects) * 100).toFixed(1) + '%' 
        : '0%',
        
      averageIssuesPerProject: statistics.totalProjects > 0
        ? (statistics.totalIssues / statistics.totalProjects).toFixed(2)
        : '0',
        
      communityEngagement: calculateEngagementScore(statistics)
    };
    
    return NextResponse.json(enhancedStatistics);
    
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

// Helper function to calculate a mock engagement score
function calculateEngagementScore(stats: any): { score: number; level: string } {
  // Mock algorithm to calculate engagement score
  const totalEntities = stats.totalEvents + stats.totalProjects + stats.totalIssues;
  const resolvedRatio = stats.totalIssues > 0 ? stats.resolvedIssues / stats.totalIssues : 0;
  const userRatio = stats.totalUsers > 0 ? totalEntities / stats.totalUsers : 0;
  
  // Calculate score (0-100)
  let score = Math.min(100, Math.max(0, 
    (resolvedRatio * 40) + // 40% weight to issue resolution
    (userRatio * 5) + // 5% weight to activity per user
    (Math.min(stats.totalUsers, 100) * 0.5) + // 0.5 point per user up to 100 users
    (stats.activeProjects * 2) // 2 points per active project
  ));
  
  score = Math.round(score * 10) / 10; // Round to 1 decimal place
  
  // Determine engagement level
  let level = 'Low';
  if (score >= 70) level = 'High';
  else if (score >= 40) level = 'Medium';
  
  return { score, level };
}

// Categories for civic issues
const CATEGORIES = ['Infrastructure', 'Safety', 'Environment', 'Vandalism'];

// Street names for random generation
const STREET_NAMES = ['Main St', 'Oak Ave', 'Park Rd', 'Center Blvd', 'Pine St', 'Maple Dr', 'Washington Ave'];

export async function GETCommunityStatistics(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get coordinates from query params
    const lat = parseFloat(searchParams.get('lat') || '37.7749');
    const lng = parseFloat(searchParams.get('lng') || '-122.4194');
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("civicchain");
    
    // Try to find statistics for this area
    let stats = await db.collection("statistics").findOne({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: 5000 // 5km radius
        }
      }
    });
    
    // If no statistics found, generate them
    if (!stats) {
      stats = generateLocalStatistics(lat, lng);
      
      // Store for future use
      await db.collection("statistics").insertOne(stats);
    }
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    
    // Fallback to generated statistics
    const stats = generateLocalStatistics(37.7749, -122.4194);
    
    return NextResponse.json({ 
      ...stats,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Generate mock statistics for an area
function generateLocalStatistics(lat: number, lng: number) {
  // Create a timestamp for this month
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);
  
  // Generate token price history (last 6 months)
  const tokenHistory = [];
  const basePrice = 0.1 + Math.random() * 0.4; // Base price between 0.1 and 0.5
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    month.setDate(1);
    
    // Create some volatility in price
    const volatility = 0.05 + (Math.random() * 0.1); // 5-15% volatility
    const direction = Math.random() > 0.6 ? 1 : -1; // More likely to go up
    const change = basePrice * volatility * direction;
    
    tokenHistory.push({
      date: month.toISOString().split('T')[0],
      price: Math.max(0.05, basePrice + (change * (5-i))).toFixed(4)
    });
  }
  
  // Recent activity data
  const activities = [
    { type: 'Issue_Reported', count: Math.floor(Math.random() * 15) + 5 },
    { type: 'Issue_Resolved', count: Math.floor(Math.random() * 10) + 2 },
    { type: 'Comments_Added', count: Math.floor(Math.random() * 30) + 10 },
    { type: 'Votes_Cast', count: Math.floor(Math.random() * 50) + 20 },
    { type: 'New_Contributors', count: Math.floor(Math.random() * 5) + 1 }
  ];
  
  // Task completion statistics
  const tasks = {
    total: Math.floor(Math.random() * 40) + 20,
    completed: Math.floor(Math.random() * 15) + 5,
    inProgress: Math.floor(Math.random() * 10) + 3,
    pending: Math.floor(Math.random() * 15) + 2
  };
  
  // Impact metrics
  const impact = {
    issuesResolved: Math.floor(Math.random() * 100) + 50,
    communitySatisfaction: Math.floor(Math.random() * 20) + 80, // 80-100%
    responseTime: Math.floor(Math.random() * 72) + 24, // 24-96 hours
    participationRate: Math.floor(Math.random() * 30) + 40, // 40-70%
    tokenDistributed: Math.floor(Math.random() * 5000) + 1000
  };
  
  // Top contributors
  const contributors = [
    { name: 'Alice Johnson', contributions: Math.floor(Math.random() * 20) + 10, tokens: Math.floor(Math.random() * 500) + 100 },
    { name: 'Bob Smith', contributions: Math.floor(Math.random() * 20) + 10, tokens: Math.floor(Math.random() * 500) + 100 },
    { name: 'Carol Williams', contributions: Math.floor(Math.random() * 20) + 5, tokens: Math.floor(Math.random() * 300) + 50 },
    { name: 'Dave Miller', contributions: Math.floor(Math.random() * 15) + 5, tokens: Math.floor(Math.random() * 200) + 50 },
    { name: 'Eva Brown', contributions: Math.floor(Math.random() * 10) + 5, tokens: Math.floor(Math.random() * 150) + 30 }
  ];
  
  return {
    id: `stats-${Date.now()}`,
    location: {
      type: "Point",
      coordinates: [lng, lat]
    },
    timestamp: new Date().toISOString(),
    tokenPrice: {
      current: parseFloat(tokenHistory[tokenHistory.length - 1].price),
      history: tokenHistory
    },
    activities,
    tasks,
    impact,
    contributors,
    engagementScore: Math.floor(Math.random() * 30) + 70, // 70-100
    resolvedThisMonth: Math.floor(Math.random() * 15) + 5,
    totalContributors: Math.floor(Math.random() * 100) + 50,
    activeIssues: Math.floor(Math.random() * 20) + 10
  };
} 
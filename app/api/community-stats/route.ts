import { NextResponse } from 'next/server';

// Specify Node.js runtime to avoid Edge runtime issues
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('lat') || '37.7749');
    const lng = parseFloat(url.searchParams.get('lng') || '-122.4194');
    
    // Generate deterministic but variable data based on coordinates
    const stats = generateCommunityStats(lat, lng);
    
    // Add a small delay to simulate API call (200-500ms)
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error generating community stats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve community statistics' },
      { status: 500 }
    );
  }
}

function generateCommunityStats(lat: number, lng: number) {
  // Create a seed from coordinates for deterministic "randomness"
  const seed = Math.abs(Math.sin(lat * lng) * 10000);
  
  // Generate stats based on seed
  const activeIssues = 5 + Math.floor(seed % 20);
  const resolvedThisMonth = 3 + Math.floor((seed * 2) % 15);
  const totalContributors = 20 + Math.floor(seed % 100);
  const engagementScore = 60 + Math.floor(seed % 36);
  
  // Generate token price history (6 months)
  const today = new Date();
  const tokenPriceHistory = [];
  let basePrice = 0.5 + (seed % 100) / 100; // Price between 0.5 and 1.5
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today);
    month.setMonth(month.getMonth() - i);
    
    // Create a price that generally trends upward with some variation
    const variation = ((seed * (i + 1)) % 40 - 20) / 100; // -0.2 to 0.2
    basePrice = Math.max(0.1, basePrice + variation);
    
    tokenPriceHistory.push({
      date: month.toISOString().split('T')[0],
      price: basePrice.toFixed(2)
    });
  }
  
  // Generate recent activities
  const activityTypes = [
    'issue_reported', 'issue_resolved', 'comment_added', 
    'vote_cast', 'new_member', 'initiative_started'
  ];
  
  const activities = activityTypes.map(type => ({
    type,
    count: 1 + Math.floor((seed * type.length) % 50)
  })).sort((a, b) => b.count - a.count);
  
  // Generate task stats
  const totalTasks = 50 + Math.floor(seed % 100);
  const completedPercentage = 30 + Math.floor(seed % 50);
  const inProgressPercentage = 20 + Math.floor((seed * 2) % 40);
  const pendingPercentage = 100 - completedPercentage - inProgressPercentage;
  
  const tasksData = {
    total: totalTasks,
    completed: Math.floor(totalTasks * (completedPercentage / 100)),
    inProgress: Math.floor(totalTasks * (inProgressPercentage / 100)),
    pending: Math.floor(totalTasks * (pendingPercentage / 100))
  };
  
  // Ensure the total adds up correctly (might be off due to rounding)
  const actualTotal = tasksData.completed + tasksData.inProgress + tasksData.pending;
  if (actualTotal !== totalTasks) {
    tasksData.pending += (totalTasks - actualTotal);
  }
  
  // Generate impact metrics
  const impactData = {
    issuesResolved: resolvedThisMonth * 3 + Math.floor(seed % 20),
    communitySatisfaction: 70 + Math.floor(seed % 25),
    responseTime: 12 + Math.floor(seed % 36),
    participationRate: 40 + Math.floor(seed % 45),
    tokenDistributed: 500 + Math.floor(seed % 2000)
  };
  
  // Generate top contributors
  const contributorNames = [
    'Alex Thompson', 'Jamie Rivera', 'Jordan Smith', 
    'Taylor Morgan', 'Casey Jones', 'Riley Johnson',
    'Avery Williams', 'Quinn Peters', 'Morgan Bailey'
  ];
  
  const contributors = contributorNames
    .slice(0, 5 + (Math.floor(seed % 4)))
    .map((name, index) => ({
      name,
      contributions: 10 + Math.floor((seed * (index + 1)) % 90),
      joinDate: new Date(today.getFullYear(), today.getMonth() - Math.floor(seed % 12), today.getDate() - Math.floor(seed % 28)).toISOString()
    }))
    .sort((a, b) => b.contributions - a.contributions);
  
  return {
    activeIssues,
    resolvedThisMonth,
    totalContributors,
    engagementScore,
    tokenPrice: {
      current: parseFloat(tokenPriceHistory[tokenPriceHistory.length - 1].price),
      history: tokenPriceHistory
    },
    activities: activities.slice(0, 4), // Just take top 4 activities
    tasks: tasksData,
    impact: impactData,
    contributors
  };
} 
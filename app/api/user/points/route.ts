import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../lib/auth';

// Simple in-memory store for the demo
// In a real app, this would be in a database
export const userPointsStore: Record<string, {
  points: number;
  history: Array<{
    source: string;
    points: number;
    timestamp: string;
    code?: string;
    walletAddress?: string;
  }>
}> = {
  // Sample data
  'default': {
    points: 125,
    history: [
      { source: 'Voting Participation', points: 50, timestamp: '2023-08-15T10:30:00Z' },
      { source: 'Community Meeting', points: 25, timestamp: '2023-09-05T15:45:00Z' }, 
      { source: 'Code: CIVIC2023', points: 50, timestamp: '2023-10-10T09:20:00Z', code: 'CIVIC2023' }
    ]
  }
};

// Store to keep track of wallet-to-userID mapping
export const walletToUserIdMap: Record<string, string> = {};

export async function GET(request: NextRequest) {
  try {
    // In a production app, authenticate the user
    // const session = await authenticateRequest(request);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // For development, use a default user ID
    // In production, get the user ID from the authentication session
    let userId = 'default'; // session?.user?.id || 'default';

    // Check if there's a wallet parameter in the request
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('wallet');
    
    if (walletAddress) {
      // If this wallet has been seen before and mapped to a user
      if (walletToUserIdMap[walletAddress]) {
        userId = walletToUserIdMap[walletAddress];
      } else {
        // First time seeing this wallet, associate it with the current user
        walletToUserIdMap[walletAddress] = userId;
      }
      
      // Mark any code redemption entries as having a wallet
      if (userPointsStore[userId]) {
        userPointsStore[userId].history.forEach(item => {
          if (item.code) {
            item.walletAddress = walletAddress;
          }
        });
      }
    }

    // Get user's points data or create a new entry if it doesn't exist
    if (!userPointsStore[userId]) {
      userPointsStore[userId] = {
        points: 0,
        history: []
      };
    }

    return NextResponse.json(userPointsStore[userId]);
  } catch (error) {
    console.error('Error fetching user points:', error);
    return NextResponse.json({ error: 'Failed to fetch points data' }, { status: 500 });
  }
} 
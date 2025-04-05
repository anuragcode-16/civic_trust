import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../lib/auth';
import { userPointsStore, walletToUserIdMap } from '../points/route';

// Valid redemption codes and their point values
const validCodes: Record<string, { points: number, used: boolean }> = {
  'CIVIC2023': { points: 50, used: false },
  'COMMUNITY': { points: 25, used: false },
  'BUILDER': { points: 75, used: false },
  'PARTICIPATE': { points: 30, used: false },
  'GOVERNANCE': { points: 40, used: false }
};

export async function POST(request: NextRequest) {
  try {
    // In a production environment, we would authenticate the user here
    // For development, we'll assume the user is authenticated
    // const session = await authenticateRequest(request);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    // Default user ID - in production, would come from session
    let userId = 'default'; // session?.user?.id || 'default';
    
    // Parse the request body
    const body = await request.json();
    const { code, walletAddress } = body;
    
    // Validate input
    if (!code) {
      return NextResponse.json({ error: 'Redemption code is required' }, { status: 400 });
    }
    
    // Check if code exists and is valid
    const normalizedCode = code.toUpperCase();
    if (!validCodes[normalizedCode]) {
      return NextResponse.json({ error: 'Invalid redemption code' }, { status: 400 });
    }
    
    // Check if code has been used
    if (validCodes[normalizedCode].used) {
      return NextResponse.json({ error: 'This code has already been redeemed' }, { status: 400 });
    }

    // If wallet address is provided, use it to find or create a user mapping
    if (walletAddress) {
      if (walletToUserIdMap[walletAddress]) {
        userId = walletToUserIdMap[walletAddress];
      } else {
        walletToUserIdMap[walletAddress] = userId;
      }
    }
    
    // Get points value from code
    const pointsEarned = validCodes[normalizedCode].points;
    
    // Initialize user points record if it doesn't exist
    if (!userPointsStore[userId]) {
      userPointsStore[userId] = {
        points: 0,
        history: []
      };
    }
    
    // Add points to user's account
    userPointsStore[userId].points += pointsEarned;
    
    // Add to history
    userPointsStore[userId].history.push({
      source: `Code: ${normalizedCode}`,
      points: pointsEarned,
      timestamp: new Date().toISOString(),
      code: normalizedCode,
      walletAddress
    });
    
    // Mark code as used
    validCodes[normalizedCode].used = true;
    
    // Return success response with points earned
    return NextResponse.json({
      success: true,
      message: `Successfully redeemed code for ${pointsEarned} points`,
      pointsEarned,
      totalPoints: userPointsStore[userId].points,
      // Include transaction details if wallet is connected
      transaction: walletAddress ? {
        hash: `0x${Array.from(normalizedCode + Date.now().toString())
          .map(c => c.charCodeAt(0).toString(16))
          .join('')
          .substring(0, 64)}`,
        status: 'confirmed',
        blockNumber: Math.floor(Math.random() * 10000000) + 10000000,
        timestamp: Date.now()
      } : null
    });
    
  } catch (error) {
    console.error('Error redeeming code:', error);
    return NextResponse.json({ error: 'Failed to redeem code' }, { status: 500 });
  }
} 
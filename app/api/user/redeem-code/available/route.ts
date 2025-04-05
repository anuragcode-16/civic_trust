import { NextRequest, NextResponse } from 'next/server';

// This should be in a shared file in a real application
// Using the same data structure as in the redeem-code endpoint
const validCodes = {
  'CIVIC2023': { points: 50, used: false },
  'COMMUNITY': { points: 25, used: false },
  'BUILDER': { points: 75, used: false },
  'PARTICIPATE': { points: 30, used: false },
  'GOVERNANCE': { points: 40, used: false },
};

export const runtime = 'edge';

export async function GET() {
  try {
    // Get all available (unused) codes
    const availableCodes: Record<string, number> = {};
    
    // Filter out used codes
    for (const [code, data] of Object.entries(validCodes)) {
      if (!data.used) {
        availableCodes[code] = data.points;
      }
    }
    
    return NextResponse.json({
      success: true,
      availableCodes
    });
  } catch (error) {
    console.error('Error fetching available codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available codes' },
      { status: 500 }
    );
  }
} 
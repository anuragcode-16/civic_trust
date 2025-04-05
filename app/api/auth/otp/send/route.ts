import { NextResponse } from 'next/server';

// In a real app, you would use environment variables for these credentials
const FAST2SMS_API_KEY = 'YOUR_FAST2SMS_API_KEY'; // Replace with actual API key

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();
    
    if (!phoneNumber || !phoneNumber.match(/^[0-9]{10}$/)) {
      return NextResponse.json(
        { error: 'Invalid phone number. Please provide a 10-digit phone number.' },
        { status: 400 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // For demo purposes, we'll simulate storing OTP in memory
    // In production, you would store this securely (e.g., Redis with expiration)
    // @ts-ignore - Global store is not typed
    global.otpStore = global.otpStore || {};
    global.otpStore[phoneNumber] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
    };

    // For demonstration only - we're not actually sending the SMS
    // In production, uncomment this code and use a real SMS API
    /*
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': FAST2SMS_API_KEY
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: phoneNumber,
      }),
    });

    const smsResponse = await response.json();
    
    if (!smsResponse.return) {
      throw new Error('Failed to send OTP');
    }
    */

    // For demo/test purposes, log the OTP to console (remove in production)
    console.log(`📱 OTP sent to ${phoneNumber}: ${otp}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully',
      // Include the OTP in response for demo purposes only - REMOVE THIS IN PRODUCTION
      otp: otp 
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phoneNumber, otp } = await request.json();
    
    if (!phoneNumber || !phoneNumber.match(/^[0-9]{10}$/)) {
      return NextResponse.json(
        { error: 'Invalid phone number. Please provide a 10-digit phone number.' },
        { status: 400 }
      );
    }

    if (!otp || !otp.match(/^[0-9]{6}$/)) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please provide a 6-digit OTP.' },
        { status: 400 }
      );
    }

    // Check if OTP exists and is valid
    // @ts-ignore - Global store is not typed
    const otpStore = global.otpStore || {};
    const storedOtpData = otpStore[phoneNumber];
    
    if (!storedOtpData) {
      return NextResponse.json(
        { error: 'OTP not found. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (Date.now() > storedOtpData.expiresAt) {
      // Clean up expired OTP
      delete otpStore[phoneNumber];
      
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // OTP validated successfully, clean up
    delete otpStore[phoneNumber];

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    );
  }
} 
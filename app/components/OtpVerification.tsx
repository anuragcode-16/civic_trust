'use client';

import { useState, useEffect } from 'react';

interface OtpVerificationProps {
  onVerificationComplete: (success: boolean) => void;
  phoneNumber: string;
}

export default function OtpVerification({ onVerificationComplete, phoneNumber }: OtpVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move focus to previous input when backspace is pressed on an empty input
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const digits = pastedData.split('').slice(0, 6);
    const newOtp = [...otp];
    
    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    
    setOtp(newOtp);
    
    // Focus on the appropriate input after paste
    if (digits.length < 6) {
      const nextInput = document.getElementById(`otp-input-${digits.length}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const sendOtp = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please try again later.');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }
      
      setOtpSent(true);
      setTimeLeft(120); // 2 minutes countdown
      
      // For demo purposes, auto-fill OTP if it's returned in the response
      if (data.otp) {
        const otpDigits = data.otp.split('');
        setOtp(otpDigits);
      }
      
    } catch (err: any) {
      console.error('OTP send error:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otp: otpString }),
      });
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please try again later.');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }
      
      onVerificationComplete(true);
      
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Failed to verify OTP. Please try again.');
      onVerificationComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-4">Phone Verification</h3>
      
      {!otpSent ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            We'll send a verification code to {phoneNumber}
          </p>
          
          <button
            type="button"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            onClick={sendOtp}
          >
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              onClick={() => onVerificationComplete(true)}
            >
              Skip verification (Demo only)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to {phoneNumber}
          </p>
          
          <div className="flex justify-between items-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            ))}
          </div>
          
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-500">
              Resend OTP in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
          ) : (
            <button
              type="button"
              className="text-primary hover:text-primary-dark text-sm font-medium"
              onClick={sendOtp}
            >
              Resend OTP
            </button>
          )}
          
          <button
            type="button"
            disabled={isLoading || otp.some(digit => !digit)}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              (isLoading || otp.some(digit => !digit)) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            onClick={verifyOtp}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          <div className="text-center mt-2">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              onClick={() => onVerificationComplete(true)}
            >
              Skip verification (Demo only)
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
} 
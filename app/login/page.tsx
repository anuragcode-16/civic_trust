'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OtpVerification from '../components/OtpVerification';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // This would be an actual API call in a real implementation
      if (aadhaarNumber.length !== 12 || !/^\d+$/.test(aadhaarNumber)) {
        throw new Error('Invalid Aadhaar number. Please enter a valid 12-digit number.');
      }

      if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
        throw new Error('Invalid phone number. Please enter a valid 10-digit number.');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Login initiated with Aadhaar:', aadhaarNumber, 'and Phone:', phoneNumber);
      
      // Move to OTP verification step
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAadhaarNumber(value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  const handleVerificationComplete = (success: boolean) => {
    if (success) {
      // Redirect to dashboard on successful login
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center">
            <span className="text-primary">Civic</span>
            <span className="text-secondary">Trust</span>
          </h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Sign in with Aadhaar
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your identity will be kept private using Anon Aadhaar
          </p>
          <div className="text-center mt-4">
            <button 
              type="button"
              className="text-primary hover:text-primary-dark text-sm font-medium"
              onClick={() => router.push('/dashboard')}
            >
              Skip Login (Demo only)
            </button>
          </div>
        </div>
        
        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="aadhaar-number" className="block text-sm font-medium text-gray-700">
                  Aadhaar Number
                </label>
                <input
                  id="aadhaar-number"
                  name="aadhaar"
                  type="text"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="12-digit Aadhaar Number"
                  value={aadhaarNumber}
                  onChange={handleAadhaarChange}
                  maxLength={12}
                />
              </div>
              
              <div>
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone-number"
                  name="phoneNumber"
                  type="text"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="10-digit Phone Number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  maxLength={10}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Verifying...' : 'Continue'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Don't have an account? Sign up
                </Link>
              </div>
              <div className="text-sm">
                <Link
                  href="/"
                  className="font-medium text-gray-600 hover:text-gray-900"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="text-sm"><strong>Aadhaar:</strong> {aadhaarNumber.replace(/(\d{4})/g, '$1 ').trim()}</p>
              <p className="text-sm"><strong>Phone:</strong> {phoneNumber.replace(/(\d{5})(\d{5})/, '$1 $2')}</p>
            </div>
            
            <OtpVerification 
              phoneNumber={phoneNumber}
              onVerificationComplete={handleVerificationComplete}
            />
            
            <div className="flex justify-center">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                onClick={() => setStep(1)}
              >
                ← Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
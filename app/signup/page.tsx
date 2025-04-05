'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OtpVerification from '../components/OtpVerification';

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    aadhaarNumber: '',
    aadhaarImage: null as File | null,
    phoneNumber: '',
    walletConnected: false,
    phoneVerified: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        aadhaarImage: e.target.files[0],
      });
    }
  };

  const handleAadhaarNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData({
      ...formData,
      aadhaarNumber: value,
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData({
      ...formData,
      phoneNumber: value,
    });
  };

  const connectWallet = async () => {
    setIsLoading(true);
    setError('');

    try {
      // This would use actual MetaMask integration in a real implementation
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      
      setFormData({
        ...formData,
        walletConnected: true,
      });
      
      console.log('Connected wallet for:', formData.name);
      
      // Move to next step or complete signup
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAadhaar = async () => {
    setIsLoading(true);
    setError('');

    try {
      // This would be an actual API call in a real implementation
      if (formData.aadhaarNumber.length !== 12 || !/^\d+$/.test(formData.aadhaarNumber)) {
        throw new Error('Invalid Aadhaar number. Please enter a valid 12-digit number.');
      }

      if (!formData.aadhaarImage) {
        throw new Error('Please upload your Aadhaar card image.');
      }

      if (formData.phoneNumber.length !== 10 || !/^\d+$/.test(formData.phoneNumber)) {
        throw new Error('Invalid phone number. Please enter a valid 10-digit number.');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Aadhaar verified:', formData.aadhaarNumber);
      
      // Move to phone verification step
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to verify Aadhaar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = (success: boolean) => {
    if (success) {
      setFormData({
        ...formData,
        phoneVerified: true,
      });
      setStep(3); // Move to wallet connection step
    }
  };

  const completeSignup = () => {
    // Redirect to dashboard on successful signup
    router.push('/dashboard');
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
            Create your account
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
              Skip Signup (Demo only)
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-8">
            <div className={`flex-1 border-t-2 ${step >= 1 ? 'border-primary' : 'border-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${step >= 1 ? 'bg-primary' : 'bg-gray-300'}`}>1</div>
            <div className={`flex-1 border-t-2 ${step >= 2 ? 'border-primary' : 'border-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}>2</div>
            <div className={`flex-1 border-t-2 ${step >= 3 ? 'border-primary' : 'border-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`}>3</div>
            <div className={`flex-1 border-t-2 ${step >= 4 ? 'border-primary' : 'border-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${step >= 4 ? 'bg-primary' : 'bg-gray-300'}`}>4</div>
            <div className={`flex-1 border-t-2 ${step >= 4 ? 'border-primary' : 'border-gray-300'}`}></div>
          </div>
          
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Aadhaar Verification</h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name (as on Aadhaar)
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleNameChange}
                />
              </div>
              
              <div>
                <label htmlFor="aadhaar-number" className="block text-sm font-medium text-gray-700">
                  Aadhaar Number
                </label>
                <input
                  id="aadhaar-number"
                  name="aadhaar"
                  type="text"
                  required
                  className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="12-digit Aadhaar Number"
                  value={formData.aadhaarNumber}
                  onChange={handleAadhaarNumberChange}
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
                  className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="10-digit Phone Number"
                  value={formData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  maxLength={10}
                />
              </div>
              
              <div>
                <label htmlFor="aadhaar-image" className="block text-sm font-medium text-gray-700">
                  Upload Aadhaar Card Image
                </label>
                <input
                  id="aadhaar-image"
                  name="aadhaarImage"
                  type="file"
                  accept="image/*"
                  required
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                  onChange={handleAadhaarUpload}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Your Aadhaar details are processed locally and never stored on our servers.
                </p>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Phone Verification</h3>
              <OtpVerification 
                phoneNumber={formData.phoneNumber}
                onVerificationComplete={handleVerificationComplete}
              />
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Connect Your Wallet</h3>
              <p className="text-sm text-gray-600">
                Connect your MetaMask wallet to participate in civic actions and governance.
              </p>
              
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm"><strong>Name:</strong> {formData.name}</p>
                <p className="text-sm"><strong>Aadhaar:</strong> {formData.aadhaarNumber.replace(/(\d{4})/g, '$1 ').trim()}</p>
                <p className="text-sm"><strong>Phone:</strong> {formData.phoneNumber.replace(/(\d{5})(\d{5})/, '$1 $2')}</p>
                <p className="text-sm"><strong>Wallet Status:</strong> {formData.walletConnected ? 'Connected' : 'Not Connected'}</p>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Account Created!</h3>
              <p className="text-sm text-gray-600">
                Your CivicTrust account has been created successfully. You can now access the platform.
              </p>
              
              <div className="bg-green-100 p-4 rounded-md text-green-800">
                <p className="font-medium">Welcome, {formData.name}!</p>
                <p className="text-sm mt-2">Your account is ready to use. Wallet has been connected successfully.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center mt-4">{error}</div>
          )}

          <div className="mt-6">
            {step === 1 && (
              <button
                type="button"
                disabled={isLoading || !formData.name || !formData.aadhaarNumber || !formData.aadhaarImage || !formData.phoneNumber}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  (isLoading || !formData.name || !formData.aadhaarNumber || !formData.aadhaarImage || !formData.phoneNumber) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                onClick={verifyAadhaar}
              >
                {isLoading ? 'Verifying...' : 'Verify Aadhaar & Continue'}
              </button>
            )}
            
            {step === 3 && (
              <button
                type="button"
                disabled={isLoading || formData.walletConnected}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  (isLoading || formData.walletConnected) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                onClick={connectWallet}
              >
                {isLoading ? 'Connecting...' : formData.walletConnected ? 'Wallet Connected' : 'Connect MetaMask Wallet'}
              </button>
            )}
            
            {step === 4 && (
              <button
                type="button"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={completeSignup}
              >
                Go to Dashboard
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm">
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary-dark"
              >
                Already have an account? Sign in
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
        </div>
      </div>
    </div>
  );
} 
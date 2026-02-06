'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import OtpVerification from '../components/OtpVerification';
import { FiShield, FiArrowRight, FiArrowLeft, FiLock } from 'react-icons/fi';

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
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 -left-4 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-300 dark:from-blue-600 dark:to-cyan-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-50"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-300 dark:from-purple-600 dark:to-pink-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-50"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute -bottom-8 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400 to-blue-300 dark:from-indigo-600 dark:to-blue-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-50"
          animate={{
            x: [-50, 50, -50],
            y: [0, -80, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400 drop-shadow-sm">
              CivicTrust
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center justify-center gap-2">
            <FiLock className="w-4 h-4" />
            Privacy-First Civic Engagement
          </p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8 relative overflow-hidden"
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

          <div className="relative z-10">
            {step === 1 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sign in with Aadhaar • Your identity stays private
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Aadhaar Input */}
                  <div className="relative group">
                    <input
                      id="aadhaar-number"
                      name="aadhaar"
                      type="text"
                      required
                      className="peer w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 text-gray-900 dark:text-white placeholder-transparent text-lg"
                      placeholder="Aadhaar Number"
                      value={aadhaarNumber}
                      onChange={handleAadhaarChange}
                      maxLength={12}
                    />
                    <label
                      htmlFor="aadhaar-number"
                      className="absolute left-5 -top-2.5 bg-white dark:bg-gray-900 px-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-600 dark:peer-focus:text-cyan-400 peer-focus:bg-white dark:peer-focus:bg-gray-900"
                    >
                      Aadhaar Number (12 digits)
                    </label>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Phone Input */}
                  <div className="relative group">
                    <input
                      id="phone-number"
                      name="phoneNumber"
                      type="text"
                      required
                      className="peer w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 text-gray-900 dark:text-white placeholder-transparent text-lg"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      maxLength={10}
                    />
                    <label
                      htmlFor="phone-number"
                      className="absolute left-5 -top-2.5 bg-white dark:bg-gray-900 px-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-600 dark:peer-focus:text-cyan-400 peer-focus:bg-white dark:peer-focus:bg-gray-900"
                    >
                      Phone Number (10 digits)
                    </label>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full py-4 px-6 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative flex items-center justify-center gap-2 text-lg">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        <>
                          Continue
                          <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* Demo Skip Button */}
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="w-full py-3 px-4 text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Skip Login (Demo Mode)
                  </button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
                  <Link
                    href="/signup"
                    className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300 font-medium flex items-center gap-1 group"
                  >
                    Create Account
                    <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 font-medium flex items-center gap-1 group"
                  >
                    <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back Home
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* OTP Step Header */}
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-2">
                    Verify OTP
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enter the code sent to your phone
                  </p>
                </div>

                {/* User Info Display */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/50 backdrop-blur-sm">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[80px]">Aadhaar:</span>
                      <span className="text-gray-900 dark:text-white font-mono text-base font-semibold">
                        {aadhaarNumber.replace(/(\d{4})/g, '$1 ').trim()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[80px]">Phone:</span>
                      <span className="text-gray-900 dark:text-white font-mono text-base font-semibold">
                        {phoneNumber.replace(/(\d{5})(\d{5})/, '$1 $2')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* OTP Verification Component */}
                <OtpVerification
                  phoneNumber={phoneNumber}
                  onVerificationComplete={handleVerificationComplete}
                />

                {/* Back Button */}
                <motion.button
                  type="button"
                  onClick={() => setStep(1)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 font-medium flex items-center justify-center gap-2 group rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  Back to Login
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Privacy Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-full border border-white/50 dark:border-gray-700/50 text-sm text-gray-700 dark:text-gray-300 shadow-lg">
            <FiShield className="w-5 h-5 text-green-500" />
            <span className="font-semibold">Protected by Zero-Knowledge Proofs</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
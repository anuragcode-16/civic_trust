'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import OtpVerification from '../components/OtpVerification';
import { FiShield, FiArrowRight, FiArrowLeft, FiUser, FiPhone, FiUpload, FiCheckCircle } from 'react-icons/fi';

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
      await new Promise(resolve => setTimeout(resolve, 1500));

      setFormData({
        ...formData,
        walletConnected: true,
      });

      console.log('Connected wallet for:', formData.name);
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
      if (formData.aadhaarNumber.length !== 12 || !/^\d+$/.test(formData.aadhaarNumber)) {
        throw new Error('Invalid Aadhaar number. Please enter a valid 12-digit number.');
      }

      if (!formData.aadhaarImage) {
        throw new Error('Please upload your Aadhaar card image.');
      }

      if (formData.phoneNumber.length !== 10 || !/^\d+$/.test(formData.phoneNumber)) {
        throw new Error('Invalid phone number. Please enter a valid 10-digit number.');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Aadhaar verified:', formData.aadhaarNumber);
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
      setStep(3);
    }
  };

  const completeSignup = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 -left-4 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-300 dark:from-purple-600 dark:to-pink-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-50"
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
          className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-300 dark:from-cyan-600 dark:to-blue-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-50"
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
          className="absolute -bottom-8 left-1/2 w-96 h-96 bg-gradient-to-br from-pink-400 to-purple-300 dark:from-pink-600 dark:to-purple-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-50"
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
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-600 dark:from-purple-400 dark:via-pink-300 dark:to-cyan-400 drop-shadow-sm">
              CivicTrust
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center justify-center gap-2">
            <FiShield className="w-4 h-4" />
            Join the Privacy-First Civic Platform
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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-2">
                Create Your Account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your identity protected with Zero-Knowledge Proofs
              </p>
            </div>

            {/* Enhanced Step Indicator */}
            <div className="flex items-center justify-between mb-10 px-4">
              {[1, 2, 3, 4].map((stepNum, index) => (
                <div key={stepNum} className="flex items-center flex-1">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: step >= stepNum ? 1 : 0.9 }}
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= stepNum
                        ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}
                  >
                    {step > stepNum ? (
                      <FiCheckCircle className="w-6 h-6" />
                    ) : (
                      stepNum
                    )}
                    {step >= stepNum && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  {index < 3 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${step > stepNum
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Aadhaar Verification */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-6">
                  Aadhaar Verification
                </h3>

                {/* Name Input */}
                <div className="relative group">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="peer w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 text-gray-900 dark:text-white placeholder-transparent text-lg"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleNameChange}
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-5 -top-2.5 bg-white dark:bg-gray-900 px-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-purple-600 dark:peer-focus:text-purple-400 peer-focus:bg-white dark:peer-focus:bg-gray-900"
                  >
                    Full Name (as on Aadhaar)
                  </label>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Aadhaar Number Input */}
                <div className="relative group">
                  <input
                    id="aadhaar-number"
                    name="aadhaar"
                    type="text"
                    required
                    className="peer w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 text-gray-900 dark:text-white placeholder-transparent text-lg font-mono"
                    placeholder="Aadhaar Number"
                    value={formData.aadhaarNumber}
                    onChange={handleAadhaarNumberChange}
                    maxLength={12}
                  />
                  <label
                    htmlFor="aadhaar-number"
                    className="absolute left-5 -top-2.5 bg-white dark:bg-gray-900 px-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-purple-600 dark:peer-focus:text-purple-400 peer-focus:bg-white dark:peer-focus:bg-gray-900"
                  >
                    Aadhaar Number (12 digits)
                  </label>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Phone Number Input */}
                <div className="relative group">
                  <input
                    id="phone-number"
                    name="phoneNumber"
                    type="text"
                    required
                    className="peer w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 text-gray-900 dark:text-white placeholder-transparent text-lg font-mono"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    maxLength={10}
                  />
                  <label
                    htmlFor="phone-number"
                    className="absolute left-5 -top-2.5 bg-white dark:bg-gray-900 px-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-purple-600 dark:peer-focus:text-purple-400 peer-focus:bg-white dark:peer-focus:bg-gray-900"
                  >
                    Phone Number (10 digits)
                  </label>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* File Upload */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Upload Aadhaar Card Image
                  </label>
                  <div className="relative group">
                    <input
                      id="aadhaar-image"
                      name="aadhaarImage"
                      type="file"
                      accept="image/*"
                      required
                      className="hidden"
                      onChange={handleAadhaarUpload}
                    />
                    <label
                      htmlFor="aadhaar-image"
                      className="flex items-center justify-center gap-3 w-full px-5 py-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 group-hover:shadow-lg"
                    >
                      <FiUpload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {formData.aadhaarImage ? formData.aadhaarImage.name : 'Click to upload Aadhaar image'}
                      </span>
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <FiShield className="w-3 h-3" />
                    Processed locally • Never stored on servers
                  </p>
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
                  type="button"
                  disabled={isLoading || !formData.name || !formData.aadhaarNumber || !formData.aadhaarImage || !formData.phoneNumber}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={verifyAadhaar}
                  className="group relative w-full py-4 px-6 rounded-2xl font-bold text-white overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                        Verify & Continue
                        <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Demo Skip Button */}
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3 px-4 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Skip Signup (Demo Mode)
                </button>
              </motion.div>
            )}

            {/* Step 2: Phone Verification */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2">
                    Verify Your Phone
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enter the OTP sent to your phone
                  </p>
                </div>

                {/* User Info Display */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 rounded-2xl border border-purple-100 dark:border-purple-800/50 backdrop-blur-sm">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[80px]">Name:</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{formData.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[80px]">Phone:</span>
                      <span className="text-gray-900 dark:text-white font-mono text-base font-semibold">
                        {formData.phoneNumber.replace(/(\d{5})(\d{5})/, '$1 $2')}
                      </span>
                    </div>
                  </div>
                </div>

                <OtpVerification
                  phoneNumber={formData.phoneNumber}
                  onVerificationComplete={handleVerificationComplete}
                />

                <motion.button
                  type="button"
                  onClick={() => setStep(1)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 font-medium flex items-center justify-center gap-2 group rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  Back to Details
                </motion.button>
              </motion.div>
            )}

            {/* Step 3: Wallet Connection */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2">
                    Connect Your Wallet
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connect MetaMask to participate in governance
                  </p>
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/50">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[100px]">Name:</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{formData.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[100px]">Aadhaar:</span>
                      <span className="text-gray-900 dark:text-white font-mono font-semibold">
                        {formData.aadhaarNumber.replace(/(\d{4})/g, '$1 ').trim()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[100px]">Phone:</span>
                      <span className="text-gray-900 dark:text-white font-mono font-semibold">
                        {formData.phoneNumber.replace(/(\d{5})(\d{5})/, '$1 $2')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[100px]">Status:</span>
                      <span className={`font-semibold ${formData.walletConnected ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {formData.walletConnected ? '✓ Connected' : 'Not Connected'}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  type="button"
                  disabled={isLoading || formData.walletConnected}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={connectWallet}
                  className="group relative w-full py-4 px-6 rounded-2xl font-bold text-white overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center justify-center gap-2 text-lg">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Connecting...
                      </>
                    ) : formData.walletConnected ? (
                      <>
                        <FiCheckCircle className="w-5 h-5" />
                        Wallet Connected
                      </>
                    ) : (
                      <>
                        Connect MetaMask
                        <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50"
                >
                  <FiCheckCircle className="w-12 h-12 text-white" />
                </motion.div>

                <div>
                  <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 mb-3">
                    Account Created!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Welcome to CivicTrust, <span className="font-bold text-gray-900 dark:text-white">{formData.name}</span>!
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800/50">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Your account is fully set up and ready to use. You can now participate in civic actions, governance, and community initiatives with complete privacy protection.
                  </p>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={completeSignup}
                  className="group relative w-full py-4 px-6 rounded-2xl font-bold text-white overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center justify-center gap-2 text-lg">
                    Go to Dashboard
                    <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* Footer Links */}
            {step < 4 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
                <Link
                  href="/login"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 font-medium flex items-center gap-1 group"
                >
                  Already have an account?
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
            <span className="font-semibold">Protected by Anon Aadhaar</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 
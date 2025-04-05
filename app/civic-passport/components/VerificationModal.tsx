'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface VerificationModalProps {
  onClose: () => void;
  onVerificationComplete: (success: boolean) => void;
}

export default function VerificationModal({ onClose, onVerificationComplete }: VerificationModalProps) {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [verificationMethod, setVerificationMethod] = useState<string | null>(null);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Camera verification states
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleVerificationMethodSelect = (method: string) => {
    setVerificationMethod(method);
    setStep(2);
    
    // Initialize camera if camera method is selected
    if (method === 'camera') {
      startCamera();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleVerify = () => {
    if (verificationMethod === 'camera') {
      if (!capturedImage) {
        setError('Please capture your photo first');
        return;
      }
      
      setLoading(true);
      setError('');
      
      // Simulate face verification API call
      setTimeout(() => {
        setLoading(false);
        // For demo, we'll just approve
        setStep(3);
        // Stop the camera stream when verification is successful
        stopCamera();
      }, 1500);
      
      return;
    }
    
    // OTP verification logic for other methods
    if (otp.some(digit => !digit)) {
      setError('Please enter the complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // For demo, we'll just approve
      setStep(3);
    }, 1500);
  };

  const handleComplete = () => {
    onVerificationComplete(true);
  };
  
  // Camera functions
  const startCamera = async () => {
    setIsCameraLoading(true);
    setError('');
    setCapturedImage(null);
    
    // Make sure any previous streams are stopped
    stopCamera();
    
    try {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('Camera API not supported, using demo mode');
        // Fallback for environments without camera support
        useDemoCamera();
        return;
      }
      
      // Create a new video element if needed
      if (!videoRef.current) {
        console.log('Video element reference not found, will initialize again when DOM is ready');
      }
      
      // Use simpler constraints for better compatibility
      const constraints = { 
        video: true,
        audio: false 
      };
      
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera access granted, setting up video element');
      
      // Store stream reference immediately to ensure cleanup works
      streamRef.current = stream;
      
      // Ensure we access the DOM element after render is complete
      setTimeout(() => {
        try {
          // Double check if video ref exists
          if (!videoRef.current) {
            console.error("Video ref not available even after waiting");
            
            // Try direct DOM query as fallback
            const videoElement = document.querySelector('[data-camera-video]') as HTMLVideoElement;
            if (videoElement) {
              console.log('Found video element via DOM query');
              // Update our ref
              // @ts-ignore - We're manually setting this for recovery
              videoRef.current = videoElement;
            } else {
              throw new Error("Could not find video element in DOM");
            }
          }
          
          console.log('Connecting stream to video element');
          // Connect stream to video element
          const video = videoRef.current;
          video.srcObject = stream;
          
          // Handle video events
          video.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            video.play()
              .then(() => {
                console.log('Video playing successfully');
                setIsCameraActive(true);
                setIsCameraLoading(false);
              })
              .catch(err => {
                console.error("Error playing video:", err);
                setError('Failed to start camera playback: ' + err.message);
                setIsCameraLoading(false);
              });
          };
          
          // Add more event handlers for troubleshooting
          video.onloadeddata = () => console.log('Video data loaded');
          video.oncanplay = () => console.log('Video can play');
          video.onplaying = () => console.log('Video is playing');
          
          video.onerror = (e) => {
            console.error("Video error:", e);
            setError('Video error occurred. Please try again.');
            setIsCameraLoading(false);
            stopCamera();
          };
        } catch (attachErr) {
          console.error("Error attaching stream to video:", attachErr);
          setError(`Failed to initialize camera: ${attachErr.message}`);
          setIsCameraLoading(false);
          stopCamera();
        }
      }, 300); // Longer timeout to ensure DOM is ready
    } catch (err) {
      console.error("Error accessing camera:", err);
      let errorMessage = 'Failed to access camera';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please check your browser permissions.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera detected on your device.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (err.message) {
        errorMessage = `Camera error: ${err.message}`;
      }
      
      setError(errorMessage);
      setIsCameraLoading(false);
      setIsCameraActive(false);
    }
  };
  
  // Demo camera for testing or when real camera isn't available
  const useDemoCamera = () => {
    console.log('Using demo camera mode');
    
    // Create a canvas to generate a fake video stream
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Could not initialize demo camera');
      setIsCameraLoading(false);
      return;
    }
    
    // Draw something on the canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.fillText('Demo Camera Mode', 220, 240);
    ctx.fillText('No real camera access', 200, 270);
    
    // Create a fake stream from the canvas
    let fakeStream: MediaStream;
    
    try {
      // @ts-ignore - Canvas API might not be typed correctly
      fakeStream = canvas.captureStream(30); // 30 FPS
      
      // Store stream reference
      streamRef.current = fakeStream;
      
      // Wait for next render cycle
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = fakeStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
              .then(() => {
                setIsCameraActive(true);
                setIsCameraLoading(false);
              })
              .catch(err => {
                console.error("Error playing demo video:", err);
                setError('Failed to start demo camera');
                setIsCameraLoading(false);
              });
          };
        } else {
          setError('Video element not available for demo mode');
          setIsCameraLoading(false);
        }
      }, 300);
    } catch (err) {
      console.error('Failed to create demo stream:', err);
      setError('Could not initialize demo camera mode. Please try another verification method.');
      setIsCameraLoading(false);
    }
  };
  
  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      console.log('Stopping tracks...');
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      console.log('Clearing video source...');
      // Modern browsers use this approach
      videoRef.current.srcObject = null;
      
      // For older browsers that might need this approach
      try {
        // @ts-ignore - For compatibility with older browsers
        if (videoRef.current.mozSrcObject) {
          // @ts-ignore
          videoRef.current.mozSrcObject = null;
        }
      } catch (e) {
        console.error('Error clearing legacy video source:', e);
      }
    }
    
    setIsCameraActive(false);
  };
  
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Camera components not initialized correctly');
      return;
    }
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) {
        setError('Could not get canvas context');
        return;
      }
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // Draw the current video frame on the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // If we're in demo mode, add a watermark
      const isDemo = !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia;
      if (isDemo) {
        console.log('Adding demo watermark to photo');
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.fillRect(10, canvas.height - 40, 200, 30);
        context.fillStyle = '#000000';
        context.font = '16px Arial';
        context.fillText('Demo Mode - Sample Photo', 20, canvas.height - 20);
      }
      
      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageDataUrl);
      
      // Stop the camera stream after capturing
      stopCamera();
    } catch (err: any) {
      console.error("Error capturing photo:", err);
      setError(`Failed to capture photo: ${err.message || 'Unknown error'}`);
    }
  }, []);
  
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div 
        className={`relative max-w-md w-full rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          className={`absolute top-4 right-4 p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          onClick={() => {
            stopCamera();
            onClose();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">Identity Verification</h2>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Verify your identity to access your Civic Passport
          </p>
        </div>

        {/* Step 1: Choose verification method */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-medium mb-3">Select verification method:</p>
            
            {/* Camera Verification Option */}
            <button 
              className={`w-full p-4 rounded-lg border flex items-center ${
                isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleVerificationMethodSelect('camera')}
            >
              <div className="p-2 rounded-full bg-primary-50 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium">Camera Verification</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Verify using facial recognition with your camera
                </p>
              </div>
            </button>
            
            <button 
              className={`w-full p-4 rounded-lg border flex items-center ${
                isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleVerificationMethodSelect('aadhaar')}
            >
              <div className="p-2 rounded-full bg-primary-50 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium">Aadhaar OTP</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Verify using OTP sent to your Aadhaar-linked mobile
                </p>
              </div>
            </button>

            <button 
              className={`w-full p-4 rounded-lg border flex items-center ${
                isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleVerificationMethodSelect('digilocker')}
            >
              <div className="p-2 rounded-full bg-primary-50 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium">DigiLocker</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Connect via DigiLocker to verify your identity
                </p>
              </div>
            </button>

            <button 
              className={`w-full p-4 rounded-lg border flex items-center ${
                isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleVerificationMethodSelect('zkp')}
            >
              <div className="p-2 rounded-full bg-primary-50 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium">Zero-Knowledge Proof</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Verify without sharing personal data using ZKP
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Step 2: Enter OTP or Camera Verification */}
        {step === 2 && (
          <div>
            <div className="flex items-center mb-6">
              <button 
                className="p-1 rounded-md hover:bg-gray-100 mr-3"
                onClick={() => {
                  setStep(1);
                  if (verificationMethod === 'camera') {
                    stopCamera();
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <p className="font-medium">
                {verificationMethod === 'aadhaar' && 'Aadhaar OTP Verification'}
                {verificationMethod === 'digilocker' && 'DigiLocker Verification'}
                {verificationMethod === 'zkp' && 'Zero-Knowledge Verification'}
                {verificationMethod === 'camera' && 'Camera Verification'}
              </p>
            </div>

            {/* Camera verification UI */}
            {verificationMethod === 'camera' ? (
              <div className="text-center">
                <div className="inline-block p-3 rounded-full bg-primary-50 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Camera Verification</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {capturedImage 
                    ? 'Review your photo and confirm to verify your identity'
                    : 'Look at the camera and take a photo to verify your identity'
                  }
                </p>
                
                <div className="mb-6 relative rounded-lg overflow-hidden">
                  {isCameraActive && !capturedImage ? (
                    <video 
                      ref={videoRef}
                      data-camera-video
                      autoPlay 
                      playsInline
                      muted
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                  ) : capturedImage ? (
                    <img 
                      src={capturedImage} 
                      alt="Captured photo" 
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className={`w-full h-64 flex items-center justify-center rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                      {isCameraLoading ? (
                        <div className="flex flex-col items-center">
                          <svg className="animate-spin h-8 w-8 text-primary mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-center text-sm">Initializing camera...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <p className="text-center text-sm mb-2">Camera not active</p>
                          <button 
                            onClick={startCamera}
                            className="px-4 py-2 bg-primary text-white rounded-md text-sm"
                          >
                            Retry Camera
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Hidden canvas for capturing images */}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                
                {error && (
                  <div className="text-center mb-4 text-red-500 text-sm">
                    {error}
                    {error.includes('permissions') && (
                      <div className="mt-2">
                        <button 
                          onClick={startCamera}
                          className="px-3 py-1 bg-primary text-white rounded-md text-xs"
                        >
                          Retry with Camera Permission
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Camera control buttons */}
                {capturedImage ? (
                  <div className="flex space-x-3 mb-4">
                    <button
                      onClick={retakePhoto}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium border ${
                        isDarkMode 
                          ? 'border-gray-600 hover:bg-gray-700' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Retake Photo
                    </button>
                    <button
                      onClick={handleVerify}
                      disabled={loading}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                        loading
                          ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} cursor-not-allowed`
                          : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                    >
                      {loading ? 'Verifying...' : 'Confirm & Verify'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={capturePhoto}
                    disabled={!isCameraActive || loading}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium transition ${
                      !isCameraActive || loading
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} cursor-not-allowed`
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    Take Photo
                  </button>
                )}
                
                <div className="mt-4 text-center">
                  <button 
                    className={`text-sm ${isDarkMode ? 'text-primary-light' : 'text-primary'} hover:underline`}
                    onClick={() => {
                      stopCamera();
                      setStep(1);
                    }}
                  >
                    Try Another Method
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-block p-3 rounded-full bg-primary-50 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-2">Enter Verification Code</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    We've sent a 4-digit code to your registered mobile number
                  </p>
                </div>

                <div className="flex justify-center space-x-3 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      className={`w-12 h-12 text-center text-xl font-bold rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                  ))}
                </div>

                {error && (
                  <div className="text-center mb-4 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium transition ${
                    loading
                      ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} cursor-not-allowed`
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    'Verify Identity'
                  )}
                </button>

                <div className="mt-4 text-center">
                  <button 
                    className={`text-sm ${isDarkMode ? 'text-primary-light' : 'text-primary'} hover:underline`}
                    onClick={() => setStep(1)}
                  >
                    Try Another Method
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Verification Success */}
        {step === 3 && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Verification Successful</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your identity has been verified. You now have full access to your Civic Passport.
            </p>
            <button
              onClick={handleComplete}
              className="w-full py-2.5 px-4 rounded-lg font-medium text-white bg-primary hover:bg-primary-dark transition"
            >
              Continue to Passport
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
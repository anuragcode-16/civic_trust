'use client';

import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Image from 'next/image';

interface PassportCardProps {
  isVerified: boolean;
}

export default function PassportCard({ isVerified }: PassportCardProps) {
  const { isDarkMode } = useTheme();
  const [showQR, setShowQR] = useState(false);

  // Sample user data
  const userData = {
    name: "Arjun Sharma",
    did: "did:polygon:0x1a2b3c...",
    aadhaarLast4: "6789",
    dob: "15-08-1992",
    gender: "Male",
    address: "Plot 42, Shivaji Nagar",
    district: "Pune",
    state: "Maharashtra",
    photoUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    qrCodeData: "did:polygon:0x1a2b3c...?vc=civic-passport&ts=1680955221",
  };

  const toggleQRCode = () => {
    setShowQR(!showQR);
  };

  return (
    <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden h-full`}>
      {/* Card header */}
      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-primary-50'} px-6 py-4 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Digital Identity Card</h2>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Blockchain Secured
            </span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 py-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-primary">
            <Image 
              src={userData.photoUrl} 
              alt="Profile"
              width={96}
              height={96}
              className="object-cover" 
            />
          </div>
          <h3 className="text-xl font-bold">{userData.name}</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            DID: {userData.did.substring(0, 15)}...
          </p>
        </div>

        {showQR ? (
          <div className="flex flex-col items-center py-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-white' : 'bg-gray-100'} mb-2`}>
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(userData.qrCodeData)}`}
                alt="QR Code"
                width={150}
                height={150}
              />
            </div>
            <p className="text-sm text-center text-gray-500 mb-4">
              Scan to verify identity
            </p>
            <button 
              onClick={toggleQRCode}
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              Show Details
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aadhaar (Last 4)</p>
                <p className="font-medium">XXXX XXXX {userData.aadhaarLast4}</p>
              </div>
              <div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date of Birth</p>
                <p className="font-medium">{userData.dob}</p>
              </div>
              <div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gender</p>
                <p className="font-medium">{userData.gender}</p>
              </div>
              <div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>District</p>
                <p className="font-medium">{userData.district}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Address</p>
              <p className="font-medium">{userData.address}, {userData.district}, {userData.state}</p>
            </div>

            <button 
              onClick={toggleQRCode}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Show QR Code
            </button>
          </>
        )}
      </div>

      {/* Card footer */}
      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-3 flex justify-between items-center border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {isVerified ? 'Verified' : 'Pending Verification'}
          </span>
        </div>
        <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Last Updated: 02 Apr 2023
        </span>
      </div>
    </div>
  );
} 
'use client';

import { useTheme } from '../../context/ThemeContext';

interface AccessLogsProps {
  isVerified: boolean;
}

export default function AccessLogs({ isVerified }: AccessLogsProps) {
  const { isDarkMode } = useTheme();

  // Sample access logs data
  const accessLogs = [
    {
      id: 1,
      service: 'PDS Ration Collection',
      location: 'Andheri East, Mumbai',
      timestamp: '2023-04-02 14:30',
      status: 'completed',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
    },
    {
      id: 2,
      service: 'ABHA Health Record Access',
      location: 'Apollo Hospital, Pune',
      timestamp: '2023-03-27 09:15',
      status: 'completed',
      icon: 'M4.5 12.75l6 6 9-13.5'
    },
    {
      id: 3,
      service: 'Voter ID Verification',
      location: 'Ward Office 12, Mumbai',
      timestamp: '2023-03-20 11:45',
      status: 'completed',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    },
    {
      id: 4,
      service: 'Electric Bill Payment',
      location: 'Digital Service, Online',
      timestamp: '2023-03-15 16:20',
      status: 'completed',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    {
      id: 5,
      service: 'Housing Subsidy Application',
      location: 'Housing Authority, Thane',
      timestamp: '2023-03-10 10:30',
      status: 'pending',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'pending':
        return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'rejected':
        return isDarkMode ? 'text-red-400' : 'text-red-600';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed':
        return isDarkMode ? 'bg-green-900 bg-opacity-20' : 'bg-green-50';
      case 'pending':
        return isDarkMode ? 'bg-yellow-900 bg-opacity-20' : 'bg-yellow-50';
      case 'rejected':
        return isDarkMode ? 'bg-red-900 bg-opacity-20' : 'bg-red-50';
      default:
        return isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
    }
  };

  return (
    <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden h-full`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between">
        <div>
          <h2 className="text-lg font-medium">Access Logs</h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Geo-timestamped service usage
          </p>
        </div>
        <button className="text-sm text-primary font-medium hover:text-primary-dark">
          View All
        </button>
      </div>

      {/* Content */}
      {isVerified ? (
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '360px' }}>
          <div className="space-y-4">
            {accessLogs.map((log) => (
              <div 
                key={log.id} 
                className={`p-4 rounded-lg ${getStatusBg(log.status)} transition-all duration-200 hover:transform hover:scale-[1.01]`}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-white'} mr-3`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={log.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{log.service}</p>
                      <span className={`text-xs capitalize font-medium ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      {log.location}
                    </p>
                    <div className="flex items-center mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {log.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center">
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Blockchain verified • Tamper-proof
            </span>
          </div>
        </div>
      ) : (
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="rounded-full bg-yellow-100 p-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-lg font-medium mb-2">Verification Required</p>
          <p className={`text-sm text-center mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Please verify your identity to view your access logs
          </p>
        </div>
      )}
    </div>
  );
} 
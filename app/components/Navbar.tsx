'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { openWhatsAppChat } from '../utils/whatsapp';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [whatsappDropdownOpen, setWhatsappDropdownOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Community', href: '/community' },
    { name: 'Community Map', href: '/community-map' },
    { name: 'Governance', href: '/governance' },
    { name: 'Proposals', href: '/proposals' },
    { name: 'Social Hub', href: '/social-hub' },
    { name: 'Wallet', href: '/wallet' },
    { name: 'Civic Passport', href: '/civic-passport' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;

  // Add a special function to check if the path is the builder
  const isBuilderPath = () => pathname === '/builder';

  // Handle WhatsApp chat functions
  const handleWhatsAppChat = (templateName: string = 'welcome') => {
    let message;
    switch (templateName) {
      case 'support':
        message = "Hello! I need support with CivicChain. Can you help me?";
        break;
      case 'feedback':
        message = "Hello! I'd like to provide feedback about CivicChain.";
        break;
      default:
        message = "Hello! Welcome to CivicChain. How can we help you today?";
    }
    openWhatsAppChat(undefined, message);
    setWhatsappDropdownOpen(false);
  };

  // Toggle WhatsApp dropdown
  const toggleWhatsAppDropdown = () => {
    setWhatsappDropdownOpen(!whatsappDropdownOpen);
  };

  return (
    <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-8 w-auto ${isDarkMode ? 'text-white' : 'text-primary'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
              <span className={`ml-2 font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>CivicTrust</span>
            </Link>
          </div>
          
          {/* Center Navigation Links */}
          <div className="hidden sm:flex flex-1 justify-center">
            <div className="flex space-x-4">
              {navigation.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.href)
                      ? `${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-primary'}`
                      : `${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:flex sm:items-center">
            {/* DAO Builder Button */}
            <Link 
              href="/builder"
              className={`mr-4 px-4 py-2 rounded-md flex items-center text-sm font-medium transition-colors ${
                isBuilderPath()
                  ? 'bg-primary text-white'
                  : 'bg-primary text-white hover:bg-primary'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Create DAO
            </Link>
            
            {/* WhatsApp Button */}
            <div className="relative">
              <button
                type="button"
                onClick={toggleWhatsAppDropdown}
                className={`p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open WhatsApp chat</span>
                <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </button>
              
              {/* WhatsApp Dropdown Menu */}
              {whatsappDropdownOpen && (
                <div 
                  className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="whatsapp-menu"
                >
                  <div className="py-1" role="none">
                    <button
                      onClick={() => handleWhatsAppChat('welcome')}
                      className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-100 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                      role="menuitem"
                    >
                      General Inquiry
                    </button>
                    <button
                      onClick={() => handleWhatsAppChat('support')}
                      className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-100 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                      role="menuitem"
                    >
                      Technical Support
                    </button>
                    <button
                      onClick={() => handleWhatsAppChat('feedback')}
                      className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-100 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                      role="menuitem"
                    >
                      Send Feedback
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`ml-3 p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className={`ml-3 p-1 rounded-full ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            >
              <span className="sr-only">View notifications</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="bg-primary flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary text-white font-bold">
                    A
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary`}
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className={`sm:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {/* Mobile DAO Builder Button */}
            <Link
              href="/builder"
              className={`block pl-3 pr-4 py-3 text-base font-medium ${
                isBuilderPath()
                  ? 'bg-primary text-white'
                  : 'bg-primary text-white'
              } rounded-md mx-2 flex items-center justify-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Create DAO
            </Link>
            
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(item.href)
                    ? `border-primary ${isDarkMode ? 'text-white bg-gray-700' : 'text-primary bg-primary-50'}`
                    : `border-transparent ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`
                }`}
              >
                {item.name}
              </Link>
            ))}
            {/* Mobile WhatsApp Button */}
            <button
              onClick={() => handleWhatsAppChat()}
              className={`w-full text-left flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium ${
                isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <svg className="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Contact via WhatsApp
            </button>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary text-white font-bold">
                  A
                </div>
              </div>
              <div className="ml-3">
                <div className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Anonymous User</div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>ID: #4F72</div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className={`ml-auto flex-shrink-0 p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <a
                href="#"
                className={`block px-4 py-2 text-base font-medium ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
              >
                Your Profile
              </a>
              <a
                href="#"
                className={`block px-4 py-2 text-base font-medium ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
              >
                Settings
              </a>
              <a
                href="#"
                className={`block px-4 py-2 text-base font-medium ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 
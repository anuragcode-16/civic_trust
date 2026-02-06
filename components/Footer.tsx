'use client';

import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="w-full border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm mt-20">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-white dark:to-cyan-400">
                            Civic<span className="text-blue-500 dark:text-blue-400">Trust</span>
                        </Link>
                        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                            Empowering citizens with privacy-first blockchain technology for a smarter, more transparent future.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><Link href="#" className="hover:text-blue-500 transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-blue-500 transition-colors">Roadmap</Link></li>
                            <li><Link href="#" className="hover:text-blue-500 transition-colors">Governance</Link></li>
                            <li><Link href="#" className="hover:text-blue-500 transition-colors">Security</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                                <FiGithub size={20} />
                            </a>
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-400 transition-colors">
                                <FiTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-700 transition-colors">
                                <FiLinkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-500">
                    <p>&copy; {new Date().getFullYear()} CivicTrust. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

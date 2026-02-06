'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-500">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-white dark:to-gray-400">
                        About CivicTrust
                    </h1>

                    <div className="prose dark:prose-invert text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed space-y-6">
                        <p>
                            CivicTrust is a next-generation platform designed to bridge the gap between citizens and local governance through decentralized technology and transparent verify-ability.
                        </p>
                        <p>
                            Built on the principles of privacy-first identity (Anon Aadhaar) and immutable record-keeping (Polygon), we empower communities to propose, vote, and track civic initiatives without compromising security or trust.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white pt-4">Our Mission</h2>
                        <p>
                            To create a future where every voice is heard, every vote counts, and every decision is verifiable. We believe that technology should serve the public interest, fostering a more engaged and responsive democracy.
                        </p>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}

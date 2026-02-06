'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import FluidBackground from '@/components/FluidBackground';
import GlassCard from '@/components/GlassCard';
import Footer from '@/components/Footer';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as any,
      },
    },
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden text-gray-900 dark:text-white font-sans selection:bg-cyan-500/30 transition-colors duration-500">
      <Navbar />
      <FluidBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20"
      >
        <div className="max-w-6xl w-full mx-auto text-center space-y-12">

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="space-y-6 pt-12">
            <span className="inline-block px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-sm font-medium text-blue-600 dark:text-cyan-300 backdrop-blur-sm">
              v0.1.0 Beta is Live
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight pb-2 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-cyan-100 dark:to-blue-200">
                Civic Engagement
              </span>
              <br />
              <span className="text-blue-600 dark:text-cyan-400">Reimagined.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
              Experience the future of smart cities with privacy-first voting, decentralized governance, and AI-driven insights.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="group relative w-full sm:w-auto overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 text-white shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 hover:shadow-cyan-500/40">
              <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
                Get Started <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl border border-gray-300 dark:border-white/20 bg-white/50 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-white/80 dark:hover:bg-white/10 transition-all backdrop-blur-sm font-semibold shadow-sm">
              Login
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 text-left">
            <GlassCard className="flex flex-col space-y-4">
              <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4">
                <Image
                  src="/privacy_shield_3d.svg"
                  alt="Privacy Shield"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy-First</h3>
              <p className="text-gray-600 dark:text-blue-100/70 leading-relaxed">
                We utilize <span className="font-semibold text-blue-600 dark:text-cyan-200">Anon Aadhaar</span> and ZK proofs to ensure your identity remains completely anonymous while verifying your citizenship.
              </p>
            </GlassCard>

            <GlassCard className="flex flex-col space-y-4">
              <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4">
                <Image
                  src="/blockchain_nodes_3d.svg"
                  alt="Blockchain Nodes"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Decentralized</h3>
              <p className="text-gray-600 dark:text-blue-100/70 leading-relaxed">
                All votes and proposals are recorded on the <span className="font-semibold text-purple-600 dark:text-purple-300">Polygon</span> blockchain, creating an immutable and transparent ledger of civic action.
              </p>
            </GlassCard>

            <GlassCard className="flex flex-col space-y-4">
              <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4">
                <Image
                  src="/ai_brain_3d.svg"
                  alt="AI Brain"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">AI Insights</h3>
              <p className="text-gray-600 dark:text-blue-100/70 leading-relaxed">
                Our custom <span className="font-semibold text-pink-600 dark:text-pink-300">BERT+LSTM</span> models analyze community sentiment and summarize complex proposals for easy understanding.
              </p>
            </GlassCard>

          </motion.div>

          {/* Social Proof / Stats Section */}
          <motion.div variants={itemVariants} className="pt-20 pb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Active Users', value: '10K+' },
                { label: 'Proposals Passed', value: '500+' },
                { label: 'Cities Onboarded', value: '12' },
                { label: 'Trust Score', value: '99%' },
              ].map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-blue-600 to-cyan-500 dark:from-white dark:to-gray-400">
                    {stat.value}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
      <Footer />
    </main>
  );
}
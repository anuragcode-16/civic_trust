'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AestheticBackground from '@/components/AestheticBackground';
import SplitText from '@/components/SplitText';
import TextType from '@/components/TextType';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const FluidGlass = dynamic(() => import('@/components/FluidGlass'), {
    ssr: false,
    loading: () => <div className="hidden" />
});

export default function FeaturesPage() {
    const mainRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    // Ref for the 3D scroll progress
    const glProgress = useRef({ value: 0 });

    useGSAP(() => {
        if (!scrollRef.current) return;

        // 1. Hero Text Animation
        const tlHero = gsap.timeline();
        tlHero.to('.hero-fade-in', { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power2.out', delay: 0.5 });

        // 2. 3D Model Scroll Sync
        // We create a proxy cleaner scroll trigger just for the 3D model
        ScrollTrigger.create({
            trigger: mainRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1, // Smooth interaction
            onUpdate: (self) => {
                glProgress.current.value = self.progress;
            }
        });

        // 3. Apple-style Sticky Sections
        const sections = gsap.utils.toArray('.feature-section') as HTMLElement[];

        sections.forEach((section, i) => {
            const content = section.querySelector('.feature-content');
            const image = section.querySelector('.feature-image');

            // Text reveal
            gsap.fromTo(content,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1,
                    scrollTrigger: {
                        trigger: section,
                        start: "top 70%",
                        end: "top 30%",
                        scrub: true
                    }
                }
            );

            // Image parallax/scale
            if (image) {
                gsap.fromTo(image,
                    { scale: 0.8, opacity: 0, rotationY: i % 2 === 0 ? 15 : -15 },
                    {
                        scale: 1.1, opacity: 1, rotationY: 0, duration: 1.5,
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%",
                            end: "bottom 20%",
                            scrub: 1
                        }
                    }
                );
            }
        });

    }, { scope: mainRef });

    return (
        <main ref={mainRef} className="relative min-h-screen overflow-hidden text-white selection:bg-purple-500/30">
            <AestheticBackground />
            <Navbar />

            {/* 3D Background - Fixed & Interactive */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Pass a getter/listener to FluidGlass.
                    Since R3F is separate context, we can't pass the ref object directly to trigger re-renders. 
                    However, we can pass the ref to the component which uses useFrame to read it.
                 */}
                <FluidGlassWrapper progressRef={glProgress} />
            </div>

            <div ref={scrollRef} className="relative z-10">
                {/* Hero Section */}
                <section className="h-screen flex flex-col items-center justify-center text-center px-4">
                    <div className="hero-fade-in translate-y-10">
                        <SplitText
                            text="CivicTrust"
                            className="text-7xl md:text-9xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                            delay={40}
                            duration={1.5}
                            splitType="chars"
                            threshold={0.2}
                        />
                    </div>
                    <div className="hero-fade-in translate-y-10 mt-6 min-h-[4rem]">
                        <TextType
                            text={["The future of democratic engagement.", "Transparent. Secure. Immutable."]}
                            className="text-2xl md:text-3xl font-light tracking-wide text-gray-300 max-w-2xl mx-auto"
                            typingSpeed={50}
                            deletingSpeed={30}
                            pauseDuration={2000}
                            loop={true}
                            startOnVisible={true}
                        />
                    </div>
                </section>

                {/* Feature 1 */}
                <section className="feature-section min-h-screen flex items-center justify-center p-6 md:p-20">
                    <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div className="feature-content">
                            <h2 className="text-5xl md:text-7xl font-bold mb-6">Immutable History.</h2>
                            <p className="text-xl text-gray-300 leading-relaxed font-light">
                                Every vote and proposal is recorded on the Polygon blockchain.
                                Once written, it cannot be altered, deleted, or censored.
                                This creates a permanent, verifiable breakdown of civic action.
                            </p>
                        </div>
                        <div className="feature-image flex justify-center">
                            <div className="relative w-full aspect-square max-w-lg bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-12 shadow-2xl">
                                <img src="/blockchain_nodes_3d.svg" alt="Blockchain" className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.5)]" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 2 */}
                <section className="feature-section min-h-screen flex items-center justify-center p-6 md:p-20">
                    <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center md:grid-flow-dense">
                        <div className="feature-image flex justify-center md:order-last">
                            <div className="relative w-full aspect-square max-w-lg bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-12 shadow-2xl">
                                <img src="/privacy_shield_3d.svg" alt="Privacy" className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(168,85,247,0.5)]" />
                            </div>
                        </div>
                        <div className="feature-content md:text-right md:order-first">
                            <h2 className="text-5xl md:text-7xl font-bold mb-6">Private Identity.</h2>
                            <p className="text-xl text-gray-300 leading-relaxed font-light">
                                Prove your citizenship without doxing yourself.
                                Leveraging <strong>Zero-Knowledge Proofs</strong> and Anon Aadhaar,
                                we ensure your voice counts while your identity remains yours alone.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Feature 3 */}
                <section className="feature-section min-h-screen flex items-center justify-center p-6 md:p-20">
                    <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div className="feature-content">
                            <h2 className="text-5xl md:text-7xl font-bold mb-6">AI Synthesis.</h2>
                            <p className="text-xl text-gray-300 leading-relaxed font-light">
                                Don't just read laws—understand them.
                                Our AI engine breaks down complex policy documents into
                                clear, unbiased summaries, highlighting the impact on your community.
                            </p>
                        </div>
                        <div className="feature-image flex justify-center">
                            <div className="relative w-full aspect-square max-w-lg bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-12 shadow-2xl">
                                <img src="/ai_brain_3d.svg" alt="AI" className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(236,72,153,0.5)]" />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-[20vh]" />
                <Footer />
            </div>
        </main>
    );
}

// Helper to pass ref to FluidGlass efficiently without re-renders
function FluidGlassWrapper({ progressRef }: { progressRef: any }) {
    // We can't access context here easily to pass to props unless we make this client component logic 
    // integrated into the canvas frame loop.
    // Ideally FluidGlass internal component reads from this ref in its useFrame.
    // For now, let's just pass the ref object, and modify FluidGlass to accept it.

    return (
        <FluidGlass
            mode="lens"
            scrollProgressRef={progressRef} // Passing Ref Object
            lensProps={{ scale: 0.45, ior: 1.25, thickness: 4 }}
        />
    );
}

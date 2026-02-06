import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Helper to manually split text (Polyfill for GSAP SplitText premium plugin)
const splitTextContent = (element: HTMLElement, type: string) => {
    const text = element.innerText;
    element.innerHTML = '';

    const chars: HTMLElement[] = [];
    const words: HTMLElement[] = [];

    // Simple split by words first
    const rawWords = text.split(' ');

    rawWords.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'split-word';
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'pre';

        if (type.includes('chars')) {
            const rawChars = word.split('');
            rawChars.forEach((char) => {
                const charSpan = document.createElement('span');
                charSpan.className = 'split-char';
                charSpan.style.display = 'inline-block';
                charSpan.innerText = char;
                wordSpan.appendChild(charSpan);
                chars.push(charSpan);
            });
        } else {
            wordSpan.innerText = word;
        }

        element.appendChild(wordSpan);
        words.push(wordSpan);

        // Add space after word if it's not the last one
        if (wordIndex < rawWords.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.innerText = ' ';
            spaceSpan.style.display = 'inline-block';
            spaceSpan.style.whiteSpace = 'pre';
            element.appendChild(spaceSpan);
        }
    });

    return { chars, words, lines: [] }; // Lines support requires more complex calculation
};


const SplitText = ({
    text,
    className = '',
    delay = 50,
    duration = 1.25,
    ease = 'power3.out',
    splitType = 'chars',
    from = { opacity: 0, y: 40 },
    to = { opacity: 1, y: 0 },
    threshold = 0.1,
    rootMargin = '-100px',
    textAlign = 'center',
    tag = 'p',
    onLetterAnimationComplete
}: any) => {
    const ref = useRef<any>(null);
    const animationCompletedRef = useRef(false);
    const onCompleteRef = useRef(onLetterAnimationComplete);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    // Keep callback ref updated
    useEffect(() => {
        onCompleteRef.current = onLetterAnimationComplete;
    }, [onLetterAnimationComplete]);

    useEffect(() => {
        if (document.fonts.status === 'loaded') {
            setFontsLoaded(true);
        } else {
            document.fonts.ready.then(() => {
                setFontsLoaded(true);
            });
        }
    }, []);

    useGSAP(
        () => {
            if (!ref.current || !text || !fontsLoaded) return;
            // Prevent re-animation if already completed
            if (animationCompletedRef.current) return;
            const el = ref.current;

            const startPct = (1 - threshold) * 100;
            // Simplified rootMargin parsing for brevity, assuming pixel values or standard format
            const start = `top ${startPct}%`;

            // Perform manual split
            // We don't have instances to revert easily in this simple polyfill, 
            // but React re-mounting handles cleanup naturally for the DOM content 
            // if we reset it, but here we just modify the DOM once.

            const { chars, words } = splitTextContent(el, splitType);

            let targets: HTMLElement[] = [];
            if (splitType.includes('chars')) targets = chars;
            else if (splitType.includes('words')) targets = words;

            if (targets.length > 0) {
                gsap.fromTo(
                    targets,
                    { ...from },
                    {
                        ...to,
                        duration,
                        ease,
                        stagger: delay / 1000,
                        scrollTrigger: {
                            trigger: el,
                            start: `top bottom${rootMargin}`, // Robust default
                            once: true,
                            toggleActions: "play none none reverse"
                        },
                        onComplete: () => {
                            animationCompletedRef.current = true;
                            onCompleteRef.current?.();
                        },
                        willChange: 'transform, opacity',
                        force3D: true
                    }
                );
            }
        },
        {
            dependencies: [
                text,
                delay,
                duration,
                ease,
                splitType,
                JSON.stringify(from),
                JSON.stringify(to),
                threshold,
                rootMargin,
                fontsLoaded
            ],
            scope: ref
        }
    );

    const Tag = tag || 'p';

    return (
        <Tag
            ref={ref}
            className={`${className} split-parent`}
            style={{ textAlign: textAlign, willChange: 'transform, opacity', visibility: fontsLoaded ? 'visible' : 'hidden' }}
        >
            {text}
        </Tag>
    );
};

export default SplitText;

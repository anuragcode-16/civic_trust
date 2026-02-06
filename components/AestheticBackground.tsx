'use client';

import { useEffect, useRef } from 'react';

export default function AestheticBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let t = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            t += 0.005;
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            // Create dynamic gradient
            const gradient = ctx.createLinearGradient(0, 0, w, h);

            // Oscillating colors
            const r1 = Math.floor(10 + 20 * Math.sin(t));
            const g1 = Math.floor(10 + 10 * Math.cos(t * 1.5));
            const b1 = Math.floor(30 + 30 * Math.sin(t * 0.5));

            const r2 = Math.floor(40 + 20 * Math.sin(t + 2));
            const g2 = Math.floor(20 + 20 * Math.cos(t * 0.8 + 2));
            const b2 = Math.floor(60 + 20 * Math.sin(t * 1.2 + 2));

            gradient.addColorStop(0, `rgb(${r1}, ${g1}, ${b1})`); // Dark slate/blue
            gradient.addColorStop(1, `rgb(${r2}, ${g2}, ${b2})`); // Dark purple/blue

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            // Gentle moving orbs/blobs
            const drawOrb = (x: number, y: number, r: number, color: string) => {
                ctx.beginPath();
                const g = ctx.createRadialGradient(x, y, 0, x, y, r);
                g.addColorStop(0, color);
                g.addColorStop(1, 'transparent');
                ctx.fillStyle = g;
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            };

            // Orb 1 (Purple)
            const x1 = w * 0.3 + Math.sin(t) * 100;
            const y1 = h * 0.4 + Math.cos(t * 1.3) * 100;
            drawOrb(x1, y1, 400, 'rgba(139, 92, 246, 0.15)');

            // Orb 2 (Blue)
            const x2 = w * 0.7 + Math.cos(t * 0.7) * 150;
            const y2 = h * 0.6 + Math.sin(t * 0.9) * 150;
            drawOrb(x2, y2, 500, 'rgba(59, 130, 246, 0.15)');

            // Orb 3 (Teal/Cyan)
            const x3 = w * 0.5 + Math.sin(t * 1.1 + Math.PI) * 200;
            const y3 = h * 0.8 + Math.cos(t * 0.5) * 100;
            drawOrb(x3, y3, 450, 'rgba(20, 184, 166, 0.1)');

            // Subtle Noise Overlay
            // (Optional: standard canvas noise can be expensive, sticking to gradients for perf)

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-30 w-full h-full pointer-events-none"
        />
    );
}

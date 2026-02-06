/* eslint-disable react/no-unknown-property */
'use client';

import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
    useFBO,
    useGLTF,
    MeshTransmissionMaterial,
    Float,
    Torus,
    Sphere
} from '@react-three/drei';
import { easing } from 'maath';
import { useTheme } from '@/context/ThemeContext';

export default function FluidGlass({ mode = 'lens', scrollProgress = 0, scrollProgressRef, lensProps = {}, barProps = {}, cubeProps = {} }: any) {
    const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
    const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;
    const { theme } = useTheme();

    const { ...modeProps } = rawOverrides;

    return (
        <div className="w-full h-full relative transition-colors duration-500">
            <Canvas
                camera={{ position: [0, 0, 20], fov: 15 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
            >
                <Wrapper modeProps={modeProps} theme={theme} scrollProgress={scrollProgress} scrollProgressRef={scrollProgressRef}>
                    <AbstractShapes scrollProgress={scrollProgress} scrollProgressRef={scrollProgressRef} />
                </Wrapper>
            </Canvas>
        </div>
    );
}

const ModeWrapper = memo(function ModeWrapper({
    children,
    glb,
    geometryKey,
    modeProps = {},
    theme,
    scrollProgress,
    scrollProgressRef,
    ...props
}: any) {
    const ref = useRef<any>();
    const { nodes } = useGLTF(glb) as any;
    const buffer = useFBO();
    const { viewport: vp } = useThree();
    const [scene] = useState(() => new THREE.Scene());
    const geoWidthRef = useRef(1);

    useEffect(() => {
        const geo = nodes[geometryKey]?.geometry;
        if (geo) {
            geo.computeBoundingBox();
            geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
        }
    }, [nodes, geometryKey]);

    useEffect(() => {
        // Clear background for canvas transparency
        scene.background = null;
    }, [scene]);

    useFrame((state, delta) => {
        const { gl, viewport, pointer, camera } = state;
        const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

        // Use ref if available, otherwise fallback to prop
        const currentScroll = scrollProgressRef ? scrollProgressRef.current.value : scrollProgress;

        const pointerX = (pointer.x * v.width) / 10;
        const pointerY = (pointer.y * v.height) / 10;
        const scrollRotation = currentScroll * Math.PI * 2;
        const scrollY = (currentScroll - 0.5) * 2;

        if (ref.current) {
            const targetPos: [number, number, number] = [pointerX, pointerY + scrollY, 15];
            const targetRot: [number, number, number] = [Math.PI / 2 + pointerY * 0.5, scrollRotation, 0];

            easing.damp3(ref.current.position, targetPos, 0.2, delta);
            easing.dampE(ref.current.rotation, targetRot, 0.2, delta);

            if (modeProps.scale == null) {
                const maxWorld = v.width * 0.9;
                const desired = maxWorld / geoWidthRef.current;
                ref.current.scale.setScalar(Math.min(0.15, desired));
            }
        }

        gl.setRenderTarget(buffer);
        gl.render(scene, camera);
        gl.setRenderTarget(null);
        gl.setClearColor(0x000000, 0);
    });

    const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

    return (
        <>
            {createPortal(children, scene)}

            <mesh scale={[vp.width, vp.height, 1]} position={[0, 0, -1]}>
                <planeGeometry />
                <meshBasicMaterial map={buffer.texture} transparent opacity={1} />
            </mesh>

            <mesh ref={ref} scale={scale ?? 0.15} rotation-x={Math.PI / 2} geometry={nodes[geometryKey]?.geometry} {...props}>
                <MeshTransmissionMaterial
                    buffer={buffer.texture}
                    ior={ior ?? 1.2}
                    thickness={thickness ?? 5}
                    anisotropy={anisotropy ?? 0.05}
                    chromaticAberration={chromaticAberration ?? 0.06}
                    roughness={0}
                    toneMapped={false}
                    resolution={512} // Efficiency
                    samples={6}      // Efficiency
                    {...extraMat}
                />
            </mesh>
        </>
    );
});

function Lens({ modeProps, theme, scrollProgress, scrollProgressRef, ...p }: any) {
    return <ModeWrapper glb="/assets/3d/lens.glb" geometryKey="Cylinder" modeProps={modeProps} theme={theme} scrollProgress={scrollProgress} scrollProgressRef={scrollProgressRef} {...p} />;
}

function Cube({ modeProps, theme, scrollProgress, scrollProgressRef, ...p }: any) {
    return <ModeWrapper glb="/assets/3d/cube.glb" geometryKey="Cube" modeProps={modeProps} theme={theme} scrollProgress={scrollProgress} scrollProgressRef={scrollProgressRef} {...p} />;
}

function Bar({ modeProps = {}, theme, scrollProgress, scrollProgressRef, ...p }: any) {
    const defaultMat = {
        transmission: 1, roughness: 0, thickness: 10, ior: 1.15,
        color: '#ffffff', attenuationColor: '#ffffff', attenuationDistance: 0.25
    };
    return (
        <ModeWrapper
            glb="/assets/3d/bar.glb"
            geometryKey="Cube"
            modeProps={{ ...defaultMat, ...modeProps }}
            theme={theme}
            scrollProgress={scrollProgress}
            scrollProgressRef={scrollProgressRef}
            {...p}
        />
    );
}

function AbstractShapes({ scrollProgress, scrollProgressRef }: { scrollProgress: number, scrollProgressRef?: any }) {
    const group = useRef<any>();

    useFrame((state, delta) => {
        if (!group.current) return;
        const currentScroll = scrollProgressRef ? scrollProgressRef.current.value : scrollProgress;

        group.current.rotation.z += delta * 0.1;
        group.current.rotation.y = currentScroll * Math.PI;
    });

    return (
        <group ref={group}>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <Torus args={[1, 0.3, 16, 32]} position={[-2, 1, -2]} material-color="#a855f7" />
            </Float>
            <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1}>
                <Sphere args={[0.8, 32, 32]} position={[2, -1, -3]} material-color="#3b82f6" />
            </Float>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
                <Torus args={[0.8, 0.2, 16, 32]} position={[0, 2, -4]} material-color="#ec4899" />
            </Float>
            <ambientLight intensity={1} />
            <pointLight position={[10, 10, 10]} intensity={2} />
        </group>
    );
}

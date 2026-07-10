import {Float, OrbitControls, PerspectiveCamera, Sparkles} from '@react-three/drei';
import {Canvas, useFrame} from '@react-three/fiber';
import {useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';

export type SculptureId = 'flux' | 'loop' | 'core';

type SceneProps = {
  palette: string[];
  energy: number;
  paused: boolean;
  active: SculptureId;
  onActiveChange: (id: SculptureId) => void;
};

function usePointerCursor(hovered: boolean) {
  useEffect(() => {
    document.body.style.cursor = hovered ? 'grab' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hovered]);
}

function Flux({
  color,
  energy,
  paused,
  active,
  onSelect,
}: {
  color: string;
  energy: number;
  paused: boolean;
  active: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  usePointerCursor(hovered);
  useFrame((state, delta) => {
    if (!ref.current || paused) return;
    ref.current.rotation.x += delta * 0.13 * energy;
    ref.current.rotation.y += delta * 0.24 * energy;
    ref.current.position.y = 0.35 + Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
  });
  return (
    <Float speed={paused ? 0 : 1.1 * energy} rotationIntensity={0.22} floatIntensity={0.4}>
      <mesh
        ref={ref}
        position={[0, 0.35, 0]}
        scale={active ? 1.15 : hovered ? 1.08 : 1}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <torusKnotGeometry args={[1.05, 0.32, 220, 32, 2, 3]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.16}
          metalness={0.32}
          clearcoat={1}
          clearcoatRoughness={0.15}
          emissive={color}
          emissiveIntensity={active ? 0.16 : 0.04}
        />
      </mesh>
    </Float>
  );
}

function Loop({
  color,
  energy,
  paused,
  active,
  onSelect,
}: {
  color: string;
  energy: number;
  paused: boolean;
  active: boolean;
  onSelect: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  usePointerCursor(hovered);
  useFrame((state, delta) => {
    if (!group.current || paused) return;
    group.current.rotation.z -= delta * 0.16 * energy;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.36) * 0.38;
  });
  return (
    <group
      ref={group}
      position={[-2.65, -0.7, -0.35]}
      scale={active ? 1.12 : hovered ? 1.06 : 1}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <torusGeometry args={[0.72, 0.16, 28, 110]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 3]} scale={0.72}>
        <torusGeometry args={[0.72, 0.11, 22, 90]} />
        <meshStandardMaterial color="#121212" roughness={0.08} metalness={0.85} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 3, 0]} scale={0.48}>
        <torusGeometry args={[0.72, 0.08, 20, 80]} />
        <meshStandardMaterial color="#f2f2ee" roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
}

function Core({
  color,
  energy,
  paused,
  active,
  onSelect,
}: {
  color: string;
  energy: number;
  paused: boolean;
  active: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  usePointerCursor(hovered);
  useFrame((state, delta) => {
    if (!ref.current || paused) return;
    ref.current.rotation.x -= delta * 0.18 * energy;
    ref.current.rotation.y += delta * 0.32 * energy;
    ref.current.position.y = -0.75 + Math.cos(state.clock.elapsedTime * 0.7) * 0.15;
  });
  return (
    <Float speed={paused ? 0 : 1.6 * energy} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh
        ref={ref}
        position={[2.6, -0.75, -0.5]}
        scale={active ? 1.05 : hovered ? 0.98 : 0.9}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[0.95, 1]} />
        <meshPhysicalMaterial
          color={color}
          wireframe={!active}
          roughness={0.32}
          metalness={0.45}
          emissive={color}
          emissiveIntensity={active ? 0.12 : 0}
        />
      </mesh>
    </Float>
  );
}

function Ribbon({energy, paused}: {energy: number; paused: boolean}) {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      Array.from({length: 18}, (_, index) => {
        const x = -4.5 + index * 0.53;
        return new THREE.Vector3(x, Math.sin(index * 0.8) * 0.35 - 1.9, -1.7);
      }),
    );
    return new THREE.TubeGeometry(curve, 180, 0.018, 8, false);
  }, []);
  useFrame((_state, delta) => {
    if (!mesh.current || paused) return;
    mesh.current.rotation.z += delta * 0.04 * energy;
  });
  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshBasicMaterial color="#121212" />
    </mesh>
  );
}

function SceneContents(props: SceneProps) {
  const rig = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!rig.current || props.paused) return;
    const pointer = state.pointer;
    rig.current.rotation.x = THREE.MathUtils.lerp(rig.current.rotation.x, pointer.y * 0.08, 0.035);
    rig.current.rotation.y = THREE.MathUtils.lerp(rig.current.rotation.y, pointer.x * 0.12, 0.035);
  });
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.15, 7.6]} fov={48} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[5, 7, 6]} intensity={3.1} color="#ffffff" />
      <pointLight position={[-4, 1, 3]} intensity={13} color={props.palette[1]} distance={8} />
      <pointLight position={[4, -2, 3]} intensity={10} color={props.palette[2]} distance={7} />
      <group ref={rig}>
        <Flux
          color={props.palette[0]}
          energy={props.energy}
          paused={props.paused}
          active={props.active === 'flux'}
          onSelect={() => props.onActiveChange('flux')}
        />
        <Loop
          color={props.palette[1]}
          energy={props.energy}
          paused={props.paused}
          active={props.active === 'loop'}
          onSelect={() => props.onActiveChange('loop')}
        />
        <Core
          color={props.palette[2]}
          energy={props.energy}
          paused={props.paused}
          active={props.active === 'core'}
          onSelect={() => props.onActiveChange('core')}
        />
        <Ribbon energy={props.energy} paused={props.paused} />
      </group>
      <Sparkles
        count={34}
        scale={[8, 5, 4]}
        size={2.2}
        speed={props.paused ? 0 : 0.2 * props.energy}
        opacity={0.42}
        color="#191919"
      />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minDistance={5}
        maxDistance={10}
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.72}
        dampingFactor={0.055}
        enableDamping
      />
    </>
  );
}

export function StudioScene(props: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.7]}
      gl={{antialias: true, alpha: true, powerPreference: 'high-performance'}}
      onPointerMissed={() => props.onActiveChange('flux')}
    >
      <SceneContents {...props} />
    </Canvas>
  );
}

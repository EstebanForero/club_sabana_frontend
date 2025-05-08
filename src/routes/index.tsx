import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Canvas, useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

type Vec3 = {
  x: number,
  y: number,
  z: number
};

type TennisBallProps = {
  initialPosition: Vec3,
  color: string,
  radius: number,
  id: number,
};

function TennisBall({ initialPosition, color, radius, id }: TennisBallProps) {
  const groupRef = React.useRef<Group>(null!);
  const actualInitialPosition = React.useRef(new Vector3(initialPosition.x, initialPosition.y, initialPosition.z)).current;

  useFrame((state, delta) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;

      groupRef.current.rotation.x += delta * (0.2 + id * 0.03);
      groupRef.current.rotation.y += delta * (0.3 + id * 0.03);
      groupRef.current.rotation.z += delta * (0.1 + id * 0.02);

      const oscillationFactor = 0.5 + (id % 3) * 0.2;
      const speedFactor = 0.8 + (id % 4) * 0.1;

      groupRef.current.position.x = actualInitialPosition.x + Math.sin(time * speedFactor * 0.7 + id) * oscillationFactor * 0.3;
      groupRef.current.position.y = actualInitialPosition.y + Math.cos(time * speedFactor + id * 1.5) * oscillationFactor * 0.5;
      groupRef.current.position.z = actualInitialPosition.z + Math.sin(time * speedFactor * 1.2 + id * 2.5) * oscillationFactor * 0.4;
    }
  });

  const seamGeometryArgs: [number, number, number, number] = [radius * 0.92, radius * 0.05, 16, 100];
  const seamMaterial = <meshStandardMaterial color={'#ffffff'} roughness={0.6} metalness={0.0} />;

  return (
    <group ref={groupRef} position={actualInitialPosition} castShadow>
      <mesh castShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>
      <mesh castShadow position={[0, 0, -0.3]}>
        <torusGeometry args={seamGeometryArgs} />
        {seamMaterial}
      </mesh>
      <mesh castShadow position={[0, 0, 0.3]}>
        <torusGeometry args={seamGeometryArgs} />
        {seamMaterial}
      </mesh>
    </group>
  );
}

const ballsData: TennisBallProps[] = [
  { initialPosition: { x: -2.2, y: 0.5, z: 0 }, color: '#ccff00', radius: 1, id: 0 },
  { initialPosition: { x: 0, y: -0.8, z: -1 }, color: '#bfff00', radius: 0.8, id: 1 },
  { initialPosition: { x: 2, y: 0.2, z: 0.5 }, color: '#d9ff00', radius: 1.1, id: 2 },
  { initialPosition: { x: 0.5, y: 1.5, z: 1.5 }, color: '#c0ff00', radius: 0.7, id: 3 },
  { initialPosition: { x: -1, y: -1.2, z: 2 }, color: '#e6ff00', radius: 0.9, id: 4 },
];

function HomeComponent() {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row items-stretch text-white font-sans bg-black">
      <div className="flex flex-col justify-center items-center md:items-start md:w-1/2 text-center md:text-left p-8 sm:p-12 md:p-16 z-10">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6">
          <span className="bg-gradient-to-r from-yellow-400 via-lime-400 to-green-500 text-transparent bg-clip-text">
            Club Sabana
          </span>
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-300">
          Where your dreams become true
        </p>
      </div>

      <div className="md:w-1/2 w-full h-[60vh] md:h-screen">
        <Canvas
          shadows
          camera={{ position: [0, 0.5, 8], fov: 50 }}
          className="w-full h-full"
        >
          <color attach="background" args={['#0a0a0a']} />

          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 5, -5]}
            intensity={0.25}
            color="hsl(30, 80%, 80%)"
          />
          <spotLight
            position={[8, 10, 8]}
            angle={0.25}
            penumbra={0.2}
            intensity={2.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
            color="hsl(60, 90%, 75%)"
          />

          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#1c1c1c" roughness={0.8} metalness={0.1} />
          </mesh>

          {ballsData.map((ball) => (
            <TennisBall
              key={ball.id}
              id={ball.id}
              initialPosition={ball.initialPosition}
              color={ball.color}
              radius={ball.radius}
            />
          ))}

          <EffectComposer>
            <Bloom
              luminanceThreshold={0.55}
              luminanceSmoothing={0.7}
              intensity={0.8}
              mipmapBlur
              height={400}
            />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
}

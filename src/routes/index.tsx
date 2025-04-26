import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import { Mesh } from 'three';

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

type Vec3 = {
  x: number,
  y: number,
  z: number
}

type CubeProps = {
  position: Vec3,
  color: string,
  size: Vec3
}

function TennisBall({ position, color, size }: CubeProps) {
  const ref = React.useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.5;
      ref.current.rotation.y += delta * 0.7;
      ref.current.position.z = Math.sin(state.clock.elapsedTime) * 2
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[position.x, position.y, position.z]}>
        <sphereGeometry args={[size.x, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[position.x, position.y, position.z + 0.7]}>
        <torusGeometry args={[1.8, 0.1]} />
        <meshStandardMaterial color={'white'} />
      </mesh>
      <mesh position={[position.x, position.y, position.z - 0.7]}>
        <torusGeometry args={[1.8, 0.1]} />
        <meshStandardMaterial color={'white'} />
      </mesh>
    </group>
  );
}

function HomeComponent() {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row items-center text-white p-8">
      <div className="flex flex-col justify-center items-start md:w-1/2">
        <h3 className="text-4xl font-bold mb-4">Club Sabana</h3>
        <p className="text-xl">Where your dreams become true</p>
      </div>
      <Canvas className="md:w-1/2 h-full min-h-[400px]" style={{ background: '#1a1a1a' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 0, 5]} />
        <TennisBall
          position={{ x: 0, y: 0, z: 0 }}
          color="#ccff00"
          size={{ x: 2, y: 2, z: 2 }}
        />
      </Canvas>
    </div>
  );
}

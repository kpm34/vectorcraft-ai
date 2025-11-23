import React, { Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TextureMode } from '../types';
import { Loader2 } from 'lucide-react';

interface Viewer3DProps {
  albedo?: string;
  normal?: string;
  roughness?: string;
  mode: TextureMode;
  geometryType: 'sphere' | 'box' | 'torus' | 'plane';
}

// 1x1 Transparent Pixel Base64
const EMPTY_TEXTURE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const GeometrySelector: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'box': return <boxGeometry args={[1.5, 1.5, 1.5]} />;
    case 'torus': return <torusGeometry args={[1, 0.4, 64, 128]} />;
    case 'plane': return <planeGeometry args={[2, 2]} />;
    case 'sphere':
    default: return <sphereGeometry args={[1, 128, 128]} />;
  }
};

// Separate component to handle texture loading via Suspense
const TexturedMesh: React.FC<Viewer3DProps> = ({ albedo, normal, roughness, mode, geometryType }) => {
  // Fix: Provide fallback EMPTY_TEXTURE instead of empty string to prevent loader crash
  const textures = useTexture({
    map: albedo || EMPTY_TEXTURE,
    normalMap: normal || EMPTY_TEXTURE,
    roughnessMap: roughness || EMPTY_TEXTURE
  });

  // Configure textures
  useEffect(() => {
    // Only configure if it's not the fallback (though configuring the fallback is harmless)
    if (textures.map) {
      textures.map.colorSpace = THREE.SRGBColorSpace;
      if (mode === TextureMode.PBR) {
        textures.map.wrapS = textures.map.wrapT = THREE.RepeatWrapping;
        textures.map.repeat.set(1, 1);
      }
    }
    
    if (textures.normalMap) {
      textures.normalMap.colorSpace = THREE.NoColorSpace; // Normal maps are data, linear
      textures.normalMap.wrapS = textures.normalMap.wrapT = THREE.RepeatWrapping;
    }

    if (textures.roughnessMap) {
      textures.roughnessMap.colorSpace = THREE.NoColorSpace; // Roughness is data, linear
      textures.roughnessMap.wrapS = textures.roughnessMap.wrapT = THREE.RepeatWrapping;
    }
    
    // Ensure updates apply
    textures.map.needsUpdate = true;
    textures.normalMap.needsUpdate = true;
    textures.roughnessMap.needsUpdate = true;
  }, [textures, mode]);

  return (
    <mesh key={`${geometryType}-${mode}-${albedo?.slice(-10)}`}>
      <GeometrySelector type={geometryType} />
      {mode === TextureMode.MATCAP ? (
        <meshMatcapMaterial 
          matcap={textures.map} 
          color={!albedo ? "#555" : undefined}
        />
      ) : (
        <meshStandardMaterial
          map={textures.map}
          // IMPORTANT: Only assign the map if the original prop existed.
          // Otherwise, we pass null so the material doesn't use the 1x1 transparent pixel.
          normalMap={normal ? textures.normalMap : null}
          roughnessMap={roughness ? textures.roughnessMap : null}
          roughness={roughness ? 1.0 : 0.5}
          metalness={0.1}
          color={!albedo ? "#666" : "#fff"}
        />
      )}
    </mesh>
  );
};

// Fallback mesh when no texture is loaded yet
const PlaceholderMesh: React.FC<{ geometryType: string; mode: TextureMode }> = ({ geometryType, mode }) => {
  return (
    <mesh>
       <GeometrySelector type={geometryType} />
       {mode === TextureMode.MATCAP ? (
         <meshMatcapMaterial color="#333" />
       ) : (
         <meshStandardMaterial color="#444" roughness={0.5} metalness={0.2} />
       )}
    </mesh>
  );
};

export const Viewer3D: React.FC<Viewer3DProps> = (props) => {
  return (
    <div className="w-full h-full bg-neutral-900 relative">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 4] }}>
        <Suspense fallback={
          <Html center>
            <div className="flex items-center gap-2 text-white bg-black/50 p-2 rounded-lg backdrop-blur-md whitespace-nowrap">
              <Loader2 className="animate-spin w-4 h-4" />
              <span className="text-xs">Loading Assets...</span>
            </div>
          </Html>
        }>
          {props.mode === TextureMode.PBR ? (
            <Stage environment="city" intensity={0.5} contactShadow={false} adjustCamera={false}>
               {props.albedo ? <TexturedMesh {...props} /> : <PlaceholderMesh geometryType={props.geometryType} mode={props.mode} />}
            </Stage>
          ) : (
            // MatCap Mode
            <>
              {props.albedo ? <TexturedMesh {...props} /> : <PlaceholderMesh geometryType={props.geometryType} mode={props.mode} />}
              <OrbitControls makeDefault autoRotate autoRotateSpeed={2.0} />
            </>
          )}
          {props.mode === TextureMode.PBR && <OrbitControls makeDefault />}
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 right-4 text-xs text-neutral-500 pointer-events-none bg-black/30 backdrop-blur px-2 py-1 rounded border border-white/5">
        {props.mode === TextureMode.MATCAP ? "MatCap Mode (No Lighting Calc)" : "PBR Mode (Physically Based)"}
      </div>
    </div>
  );
};

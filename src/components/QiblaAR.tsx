import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CameraPreview } from "@capacitor-community/camera-preview";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { X, Info } from "lucide-react";
import { toast } from "sonner";

interface QiblaARProps {
  qiblaDirection: number; // Geographical bearing in degrees
  onClose: () => void;
}

export const QiblaAR: React.FC<QiblaARProps> = ({ qiblaDirection, onClose }) => {
  const { t, language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [deviceHeading, setDeviceHeading] = useState(0);

  // Initialize Camera Preview
  useEffect(() => {
    const startCamera = async () => {
      try {
        await CameraPreview.start({
          parent: "cameraPreviewContainer",
          position: "rear",
          toBack: true,
        });
        setIsCameraActive(true);
        // Make body transparent to see camera preview
        document.body.style.backgroundColor = "transparent";
      } catch (e) {
        console.error("Camera Preview Error:", e);
        toast.error(language === "ar" ? "فشل تشغيل الكاميرا" : "Failed to start camera");
        onClose();
      }
    };

    startCamera();

    return () => {
      CameraPreview.stop();
      document.body.style.backgroundColor = ""; // Restore background
    };
  }, [onClose, language]);

  // Three.js Setup
  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Qibla Beam (The "Beam of Light")
    // Let's make it a tapered cylinder for a "beam" effect
    const geometry = new THREE.CylinderGeometry(0.1, 1, 100, 32, 1, true);
    const material = new THREE.MeshBasicMaterial({
      color: 0xc5a059, // Matte Gold
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const beam = new THREE.Mesh(geometry, material);

    // Rotate the beam to lay flat on the ground initially if needed, 
    // but we want it to point towards the horizon in the Qibla direction.
    // Geographical Bearing: 0 is North, 90 is East, etc.
    // Three.js: -Z is North, +X is East.
    
    const bearingRad = (qiblaDirection * Math.PI) / 180;
    
    // We want the beam to point towards (sin(bearing), 0, -cos(bearing))
    // The cylinder is created along the Y axis. Let's rotate it.
    beam.rotation.x = Math.PI / 2; // Lay it horizontal
    beam.rotation.z = -bearingRad; // Rotate to bearing (Three.js Z is North, so we subtract from 0)
    
    // Position it slightly "ahead" so it doesn't clip the camera
    beam.position.set(
      Math.sin(bearingRad) * 50,
      -1.5, // Slightly below eye level
      -Math.cos(bearingRad) * 50
    );

    scene.add(beam);

    // Add some "rings" or "pulses" to the beam for a "techy" AR look
    for (let i = 1; i <= 5; i++) {
        const ringGeo = new THREE.TorusGeometry(2 * i, 0.05, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x0a5c42, transparent: true, opacity: 0.3 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.rotation.y = -bearingRad;
        ring.position.set(
            Math.sin(bearingRad) * (10 * i),
            -1.5,
            -Math.cos(bearingRad) * (10 * i)
        );
        scene.add(ring);
    }

    // Device Orientation Listener
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha === null) return;

      // alpha is rotation around Z axis [0, 360]
      // beta is rotation around X axis [-180, 180]
      // gamma is rotation around Y axis [-90, 90]
      
      const alpha = event.alpha;
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;

      // Update camera rotation based on device orientation
      // This is a simplified version. For full accuracy, complex quaternions are usually needed.
      // But for a "radar" vibe, orienting the camera works.
      
      const yaw = THREE.MathUtils.degToRad(alpha);
      const pitch = THREE.MathUtils.degToRad(beta - 90);
      const roll = THREE.MathUtils.degToRad(gamma);

      camera.rotation.set(pitch, roll, yaw, 'ZXY');
      setDeviceHeading(alpha);
    };

    window.addEventListener("deviceorientation", handleOrientation);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Pulse the beam opacity
      if (beam.material instanceof THREE.Material) {
          (beam.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(Date.now() * 0.002) * 0.2;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [qiblaDirection]);

  return (
    <div className="fixed inset-0 z-[100] bg-transparent overflow-hidden">
      {/* Container for Camera Preview (behind webview) */}
      <div id="cameraPreviewContainer" className="absolute inset-0 z-[-1]" />

      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 pointer-events-none" />

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
        <div className="flex justify-between items-start pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40"
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-white/70 uppercase tracking-wider">{language === 'ar' ? 'البوصلة' : 'Heading'}</span>
                <span className="text-xl font-bold text-gold-matte font-amiri">{Math.round(deviceHeading)}°</span>
             </div>
          </div>
        </div>

        {/* Alignment Indicator */}
        <div className="flex-1 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white/10 rounded-full flex items-center justify-center">
                <div className={`w-48 h-48 border-2 rounded-full transition-all duration-300 ${Math.abs((qiblaDirection - (360 - deviceHeading) + 360) % 360) < 5 ? 'border-emerald-400 scale-110 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : 'border-white/30 scale-100'}`}>
                   <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-1 h-12 bg-gold-matte rounded-full animate-pulse" />
                   </div>
                </div>
            </div>
        </div>

        <div className="space-y-4 pointer-events-auto">
          <div className="bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-matte/20 flex items-center justify-center">
               <Info className="w-6 h-6 text-gold-matte" />
            </div>
            <div>
              <p className="text-white font-medium">
                {language === "ar" ? "اتبع شعاع النور الذهبي" : "Follow the golden beam of light"}
              </p>
              <p className="text-white/60 text-xs text-balance">
                {language === "ar" 
                  ? "وجه هاتفك نحو الأفق لرؤية مسار اتجاه القبلة في الفضاء." 
                  : "Point your phone towards the horizon to see the path to the Qibla in 3D space."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

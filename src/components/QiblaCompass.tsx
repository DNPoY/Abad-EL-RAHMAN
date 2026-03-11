import { memo } from 'react';
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Compass, Navigation, Camera } from "lucide-react";
import { toast } from "sonner";
import { QiblaAR } from "./QiblaAR";

export const QiblaCompass = memo(() => {
  const { t, language } = useLanguage();
  // Load cached values immediately to prevent waiting
  const [qiblaDirection, setQiblaDirection] = useState<number>(() => {
    const cached = localStorage.getItem("qiblaDirection");
    return cached ? parseFloat(cached) : 0;
  });
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [showAR, setShowAR] = useState(false);

  useEffect(() => {
    const calculateQibla = (latitude: number, longitude: number) => {
      // Kaaba coordinates
      const kaabaLat = 21.4225;
      const kaabaLng = 39.8262;

      const lat1 = (latitude * Math.PI) / 180;
      const lat2 = (kaabaLat * Math.PI) / 180;
      const dLng = ((kaabaLng - longitude) * Math.PI) / 180;

      const y = Math.sin(dLng) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

      let bearing = Math.atan2(y, x);
      bearing = (bearing * 180) / Math.PI;
      bearing = (bearing + 360) % 360;

      setQiblaDirection(bearing);
      localStorage.setItem("qiblaDirection", bearing.toString());
    };

    if ("geolocation" in navigator) {
      // 1. Try to get cached location immediately (fastest)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          calculateQibla(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log("Cached location failed, trying fresh...", error);
          // 2. Fallback to fresh location if no cache available
          navigator.geolocation.getCurrentPosition(
            (position) => {
              calculateQibla(position.coords.latitude, position.coords.longitude);
            },
            (err) => console.error("Error getting location:", err),
            { enableHighAccuracy: true, timeout: 6000 } // 6 seconds
          );
        },
        { maximumAge: 540000, timeout: 6000, enableHighAccuracy: false } // 9 mins maximumAge, 6 seconds timeout
      );
    }
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ("DeviceOrientationEvent" in window && typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === "granted") {
            setHasPermission(true);
          }
        } catch (error) {
          console.error("Permission denied:", error);
        }
      } else {
        setHasPermission(true);
      }
    };

    requestPermission();
  }, []);

  useEffect(() => {
    if (!hasPermission) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const alpha = event.alpha || 0;
      setDeviceHeading(360 - alpha);
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [hasPermission]);

  const relativeQibla = (qiblaDirection - deviceHeading + 360) % 360;
  const isAligned = Math.abs(relativeQibla) < 5 || Math.abs(relativeQibla) > 355;

  useEffect(() => {
    if (isAligned && "vibrate" in navigator) {
      navigator.vibrate(50);
    }
  }, [isAligned]);

  return (
    <Card className="p-6 border-emerald-deep/20 bg-gradient-to-br from-cream to-white shadow-xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold font-amiri mb-1 text-emerald-deep">{t.qiblaDirection}</h3>
        <p className="text-sm text-muted-foreground">{t.pointNorth}</p>
      </div>

      <div className="relative w-72 h-72 mx-auto">
        {/* Outer Ring - Elegant Gold Border */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-matte via-gold-light to-gold-matte p-1 shadow-2xl shadow-gold-matte/30">
          {/* Compass Body - Cream background */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-cream to-white relative overflow-hidden">

            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(var(--deep-emerald)) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* Rotating Dial - Points North */}
            <div
              className="absolute inset-0 transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${-deviceHeading}deg)` }}
            >
              {/* Degree Markers */}
              {[...Array(72)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 left-1/2 origin-bottom"
                  style={{ height: '50%', transform: `translateX(-50%) rotate(${i * 5}deg)` }}
                >
                  <div className={`w-0.5 ${i % 6 === 0 ? 'h-3 bg-emerald-deep' : 'h-1.5 bg-emerald-deep/30'}`} />
                </div>
              ))}

              {/* Cardinal Points */}
              <div className="absolute inset-4">
                <span className="absolute top-1 left-1/2 -translate-x-1/2 font-bold text-red-500 text-lg font-amiri drop-shadow-sm">N</span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-bold text-emerald-deep text-lg font-amiri">S</span>
                <span className="absolute top-1/2 left-1 -translate-y-1/2 font-bold text-emerald-deep text-lg font-amiri">W</span>
                <span className="absolute top-1/2 right-1 -translate-y-1/2 font-bold text-emerald-deep text-lg font-amiri">E</span>
              </div>
            </div>

            {/* Qibla Needle */}
            <div
              className="absolute inset-0 transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${-deviceHeading}deg)` }}
            >
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${qiblaDirection}deg)` }}
              >
                {/* Needle Pointer */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  {/* Kaaba Icon */}
                  <div className={`transition-all duration-500 ${isAligned ? "scale-125 animate-pulse" : "scale-100"}`}>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-deep to-emerald-800 flex items-center justify-center shadow-lg ${isAligned ? 'shadow-emerald-deep/50 ring-2 ring-gold-matte ring-offset-2' : ''}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="5" y="6" width="14" height="14" fill="#1a1a1a" stroke="#C5A059" strokeWidth="1.5" />
                        <rect x="5" y="10" width="14" height="2" fill="#C5A059" />
                        <path d="M5 6L12 2L19 6" stroke="#C5A059" strokeWidth="1.5" fill="none" />
                      </svg>
                    </div>
                  </div>
                  {/* Needle Shaft */}
                  <div className={`w-1 h-24 -mt-1 bg-gradient-to-b from-emerald-deep via-emerald-deep/80 to-transparent rounded-full ${isAligned ? 'shadow-[0_0_10px_rgba(9,66,49,0.5)]' : ''}`} />
                </div>
              </div>
            </div>

            {/* Center Pivot */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-matte to-gold-light border-2 border-white shadow-lg z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Info Display */}
      <div className="mt-8 text-center space-y-4">
        <div className="flex flex-col gap-3 items-center">
            <Button 
                onClick={() => setShowAR(true)}
                className="w-full bg-emerald-deep hover:bg-emerald-800 text-white gap-2 py-6 rounded-2xl shadow-lg ring-1 ring-gold-matte/30"
            >
                <Camera className="w-5 h-5 text-gold-matte" />
                {language === 'ar' ? 'عرض الواقع المعزز (AR)' : 'Open AR Radar'}
            </Button>
            
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-emerald-deep/10 shadow-sm w-full justify-center">
                <div className="text-center">
                    <span className="text-xs text-muted-foreground block">{language === 'ar' ? 'اتجاهك' : 'Heading'}</span>
                    <span className="text-2xl font-bold text-emerald-deep font-amiri">{Math.round(deviceHeading)}°</span>
                </div>
                <Navigation className="w-5 h-5 text-gold-matte mx-2" />
                <div className="text-center">
                    <span className="text-xs text-muted-foreground block">{language === 'ar' ? 'القبلة' : 'Qibla'}</span>
                    <span className={`text-2xl font-bold font-amiri ${isAligned ? 'text-green-600' : 'text-gold-matte'}`}>{Math.round(qiblaDirection)}°</span>
                </div>
            </div>
        </div>

        {isAligned && (
          <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full animate-bounce border border-green-200">
            <Compass className="w-5 h-5" />
            <span className="font-bold">{language === "ar" ? "القبلة صحيحة!" : "You are facing the Qibla!"}</span>
          </div>
        )}
      </div>
      
      {showAR && (
        <QiblaAR 
            qiblaDirection={qiblaDirection} 
            onClose={() => setShowAR(false)} 
        />
      )}
    </Card>
  );
});
QiblaCompass.displayName = "QiblaCompass";

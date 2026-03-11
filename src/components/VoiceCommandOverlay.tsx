import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceCommandOverlayProps {
  isListening: boolean;
  isSupported: boolean;
  toggleListening: () => void;
}

export const VoiceCommandOverlay = ({
  isListening,
  isSupported,
  toggleListening,
}: VoiceCommandOverlayProps) => {
  if (!isSupported) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-center gap-2">
      {isListening && (
        <div className="absolute -inset-2 bg-gold-matte/20 rounded-full animate-ping pointer-events-none" />
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleListening}
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all duration-500 border border-white/20 backdrop-blur-md",
          isListening 
            ? "bg-gold-matte text-white scale-110 shadow-gold-matte/40" 
            : "bg-emerald-deep/80 text-emerald-100 hover:bg-emerald-deep"
        )}
        aria-label={isListening ? "Stop Voice Commands" : "Start Voice Commands"}
      >
        {isListening ? (
          <Mic className="h-7 w-7 animate-pulse" />
        ) : (
          <MicOff className="h-7 w-7" />
        )}
      </Button>
      
      {isListening && (
        <div className="bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full animate-fade-in font-tajawal">
          Listening...
        </div>
      )}
    </div>
  );
};

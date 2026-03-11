import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

export interface VoiceCommand {
  keywords: string[];
  action: () => void;
  feedback: string;
}

export const useVoiceCommands = (commands: VoiceCommand[]) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; // We'll try to detect both, but start with English for commands

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log('Voice Transcript:', transcript);

        for (const command of commands) {
          if (command.keywords.some(keyword => transcript.includes(keyword.toLowerCase()))) {
            command.action();
            speakFeedback(command.feedback);
            toast.success(command.feedback);
            break;
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech Recognition Error:', event.error);
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied');
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start(); // Auto-restart if we're supposed to be listening
        }
      };

      recognitionRef.current = recognition;
    }
  }, [commands, isListening]);

  const speakFeedback = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    // Use Arabic for Arabic feedback if detected
    if (/[\u0600-\u06FF]/.test(text)) {
      utterance.lang = 'ar-SA';
    } else {
      utterance.lang = 'en-US';
    }
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info('Voice commands stopped');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success('Voice commands active. Say "Start Recovery Protocol"');
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  }, [isListening]);

  return { isListening, isSupported, toggleListening, speakFeedback };
};

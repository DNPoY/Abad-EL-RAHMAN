import { useState, useEffect } from 'react';
import { eventBasedDuas } from '@/lib/duas/event-based';
import { DuaItem } from '@/lib/duas/types';

export const useEventDuas = () => {
  const [suggestedDuas, setSuggestedDuas] = useState<DuaItem[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from a weather API or sync with a calendar.
    // For now, we simulate "sensors" by checking time and potentially random events.
    
    const checkEvents = () => {
      const suggestions: DuaItem[] = [];
      const now = new Date();
      const hour = now.getHours();

      // 1. Simulation: If it's "cloudy/rainy" (simulated by a 10% chance every check)
      // Or we can use more deterministic logic for a better demo
      const isRainy = Math.random() > 0.9;
      if (isRainy) {
        const rainDua = eventBasedDuas.find(d => d.id === "ev_rain_1");
        if (rainDua) suggestions.push(rainDua);
      }

      // 2. Night time suggestion (Fear/Nightmares)
      if (hour >= 22 || hour <= 4) {
        const fearDua = eventBasedDuas.find(d => d.id === "ev_fear");
        if (fearDua) suggestions.push(fearDua);
      }

      // 3. Early morning (Rooster)
      if (hour >= 4 && hour <= 6) {
        const roosterDua = eventBasedDuas.find(d => d.id === "ev_rooster");
        if (roosterDua) suggestions.push(roosterDua);
      }

      // 4. Hilal (New Moon) - Simulating around the 1st of the month
      if (now.getDate() === 1) {
        const hilalDua = eventBasedDuas.find(d => d.id === "ev_hilal");
        if (hilalDua) suggestions.push(hilalDua);
      }

      setSuggestedDuas(suggestions);
    };

    checkEvents();
    const interval = setInterval(checkEvents, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return { suggestedDuas };
};

"use client";

import { useEffect, useState } from "react";
import { premiumColors, timeToColors, fontFamilies } from "@/lib/colors-premium";
import { UserLocation, SunPosition, detectLocation, calculateSunPosition, getTimeOfDay } from "@/lib/location";

export function DynamicTheme({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [sun, setSun] = useState<SunPosition | null>(null);

  useEffect(() => {
    detectLocation().then((loc) => {
      setLocation(loc);
      const sunPos = calculateSunPosition(loc.lat, loc.lng);
      setSun(sunPos);
    });

    const interval = setInterval(() => {
      if (location) {
        const sunPos = calculateSunPosition(location.lat, location.lng);
        setSun(sunPos);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sun) {
      const timeColors = timeToColors(sun.hour);
      const timeOfDay = getTimeOfDay(sun.hour);
      const root = document.documentElement;

      root.style.setProperty('--bg-primary', premiumColors.surface.obsidian);
      root.style.setProperty('--bg-secondary', premiumColors.surface.deep);
      root.style.setProperty('--bg-panel', premiumColors.ui.panel);
      root.style.setProperty('--border-color', premiumColors.ui.border);
      root.style.setProperty('--text-primary', premiumColors.text.light);
      root.style.setProperty('--text-secondary', premiumColors.text.warm);
      root.style.setProperty('--text-muted', premiumColors.text.muted);
      root.style.setProperty('--accent-primary', premiumColors.primary.gold);
      root.style.setProperty('--accent-secondary', premiumColors.primary.copper);
      root.style.setProperty('--accent-emerald', premiumColors.accent.emerald);
      root.style.setProperty('--accent-ruby', premiumColors.accent.ruby);
      root.style.setProperty('--accent-sapphire', premiumColors.accent.sapphire);
      root.style.setProperty('--accent-amethyst', premiumColors.accent.amethyst);
      root.style.setProperty('--accent-topaz', premiumColors.accent.topaz);
      root.style.setProperty('--accent-coral', premiumColors.accent.coral);
      root.style.setProperty('--accent-jade', premiumColors.accent.jade);
      root.style.setProperty('--accent-sunstone', premiumColors.accent.sunstone);
      root.style.setProperty('--glow-gold', premiumColors.ui.glow);
      root.style.setProperty('--glow-hover', premiumColors.ui.hover);
      root.style.setProperty('--glow-active', premiumColors.ui.active);
      root.style.setProperty('--glass-bg', premiumColors.ui.glass);
      root.style.setProperty('--sky-color', timeColors.sky);
      root.style.setProperty('--ground-color', timeColors.ground);
      root.style.setProperty('--ambient-color', timeColors.ambient);
      root.style.setProperty('--light-intensity', String(timeColors.light));
      root.style.setProperty('--font-heading', fontFamilies.heading);
      root.style.setProperty('--font-body', fontFamilies.body);
      root.style.setProperty('--font-accent', fontFamilies.accent);
      root.style.setProperty('--font-display', fontFamilies.display);
      root.style.setProperty('--font-ui', fontFamilies.ui);
      root.setAttribute('data-time-of-day', timeOfDay);
      root.setAttribute('data-theme', 'premium');

      document.body.style.fontFamily = fontFamilies.body;
      document.body.style.backgroundColor = premiumColors.surface.obsidian;
      document.body.style.color = premiumColors.text.light;
    }
  }, [sun]);

  return <>{children}</>;
}

"use client";

import { useEffect } from "react";

/** Adds `music-theme` to <html> while a MusicHub page is open, so modals/portals get the dark theme too. */
export function MusicThemeScope() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("music-theme");
    return () => root.classList.remove("music-theme");
  }, []);

  return null;
}
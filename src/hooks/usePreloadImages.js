import { useEffect } from 'react';
import IMAGE_MANIFEST from '../config/imageManifest';

/**
 * Preloads every image in the manifest on first mount by warming the browser
 * cache. Images fetched here are served from cache when a page later renders
 * its <img>, so nothing pops in during navigation.
 */
export default function usePreloadImages() {
  useEffect(() => {
    const base = process.env.PUBLIC_URL || '';
    const images = IMAGE_MANIFEST.map((path) => {
      const img = new Image();
      img.src = base + path;
      return img;
    });

    return () => {
      // Drop references so the fetches can be GC'd if unmounted early.
      images.forEach((img) => { img.src = ''; });
    };
  }, []);
}

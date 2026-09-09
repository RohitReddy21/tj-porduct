import React, { useEffect, useRef, useState } from 'react';

/**
 * Hero background video.
 *
 * Replaces the old Three.js canvas. The poster image carries the visual on its
 * own, so the video is treated as an enhancement and is skipped entirely when it
 * would be wasteful or unwanted:
 *   - `prefers-reduced-motion` is set
 *   - the viewport is phone-sized (saves ~1MB of mobile data)
 *   - the browser reports a slow connection or data-saver mode
 *
 * Source: Pexels video 3129671 by Pressmaster, hue-shifted to the brand blue.
 * Pexels License — free for commercial use, no attribution required.
 */
export default function HeroVideo({
  src = '/assets/video/hero-network.mp4',
  poster = '/assets/video/hero-network.jpg',
}) {
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const smallScreen = window.matchMedia('(max-width: 767px)');
    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slowNetwork =
      connection?.saveData === true || /^(slow-2g|2g|3g)$/.test(connection?.effectiveType ?? '');

    const decide = () => {
      setShowVideo(!reduceMotion.matches && !smallScreen.matches && !slowNetwork);
    };

    decide();
    reduceMotion.addEventListener('change', decide);
    smallScreen.addEventListener('change', decide);
    return () => {
      reduceMotion.removeEventListener('change', decide);
      smallScreen.removeEventListener('change', decide);
    };
  }, []);

  // Some browsers reject autoplay even when muted; the poster stays visible if so.
  useEffect(() => {
    if (!showVideo) return;
    videoRef.current?.play?.().catch(() => {});
  }, [showVideo]);

  return (
    <div className="hero-video" aria-hidden="true">
      {showVideo ? (
        <video
          ref={videoRef}
          className="hero-video-el"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
      ) : (
        <img className="hero-video-el" src={poster} alt="" loading="eager" decoding="async" />
      )}
      <div className="hero-video-scrim" />
    </div>
  );
}

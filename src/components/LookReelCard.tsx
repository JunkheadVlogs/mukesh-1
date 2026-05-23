import { useState, useEffect, useRef } from "react";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router";

interface LookReel {
  id: string;
  youtubeId: string;
  title: string;
  category: string;
  subtitle: string;
  badge: string;
  poster: string;
}

interface LookReelCardProps {
  reel: LookReel;
  onVisibilityChange: (id: string, isVisible: boolean) => void;
  shouldRenderIframe: boolean;
  isActive: boolean;
}

/**
 * Extracts YouTube Video ID from any standard link format, including:
 * - youtube.com/shorts/VIDEO_ID
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 */
function parseYouTubeVideoID(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  if (!trimmed.includes("/") && !trimmed.includes(".")) {
    return trimmed;
  }
  const regExps = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
  ];
  for (const reg of regExps) {
    const match = trimmed.match(reg);
    if (match && match[1]) {
      return match[1];
    }
  }
  return trimmed;
}

export function LookReelCard({ reel, onVisibilityChange, shouldRenderIframe, isActive }: LookReelCardProps) {
  const videoId = parseYouTubeVideoID(reel.youtubeId);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [videoReadyToFade, setVideoReadyToFade] = useState(false);
  const isIframeMounted = shouldRenderIframe;

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  
  // Parse YouTube API events to get live updates for currentTime and duration
  useEffect(() => {
    if (!isIframeMounted) return;

    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("youtube") && !event.origin.includes("ytimg")) {
        return;
      }
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data && data.event === "info_delivery" && data.info) {
          const info = data.info;
          if (info.duration !== undefined && info.duration > 0) {
            setDuration(info.duration);
          }
          if (info.currentTime !== undefined) {
            setCurrentTime(info.currentTime);
          }
        }
      } catch (err) {
        // Safe ignore
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isIframeMounted]);

  // Set up intersection observer to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
          onVisibilityChange(reel.id, true);
        } else {
          setIsVisible(false);
          setIsPlaying(false);
          setVideoReadyToFade(false);
          onVisibilityChange(reel.id, false);
        }
      },
      {
        threshold: 0.1, // Trigger. Trigger when at least 10% of the video card is visible
        rootMargin: "150px", // Preload much earlier before entering
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      onVisibilityChange(reel.id, false);
    };
  }, [reel.id, onVisibilityChange]);

  // Handle active status, play, and sound state elegantly
  useEffect(() => {
    if (isActive && isVisible && isIframeMounted) {
      setIsPlaying(true);
      
      // Force initial mute behavior to bypass strict mobile/desktop browser autoplay policies.
      // This is the ONLY way to guarantee the video starts playing automatically on modern devices.
      // If the user has already unmuted a video since landing, we can keep it unmuted since browser allows gesture-associated sound.
      const previouslyUnmuted = !!(window as any).__userHasUnmutedReels;
      setIsMuted(!previouslyUnmuted);
      
      if (previouslyUnmuted) {
        window.dispatchEvent(new CustomEvent("unmute-reel", { detail: { id: reel.id } }));
      }

      // Automatically fade out the poster after a short duration (at most 500ms) to ensure instant play
      const timer = setTimeout(() => {
        setVideoReadyToFade(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
      setIsMuted(true); // Always mute when scrolled away
      setVideoReadyToFade(false);
    }
  }, [isActive, isVisible, isIframeMounted, reel.id]);

  // Sync player play/pause state
  useEffect(() => {
    if (isIframeMounted && iframeRef.current) {
      const command = isPlaying ? "playVideo" : "pauseVideo";
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: command, args: [] }),
        "*"
      );
    }
  }, [isPlaying, isIframeMounted, iframeLoaded]);

  // Sync mute state
  useEffect(() => {
    if (isIframeMounted && iframeRef.current) {
      const command = isMuted ? "mute" : "unMute";
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: command, args: [] }),
        "*"
      );
      if (!isMuted) {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "setVolume", args: [100] }),
          "*"
        );
      }
    }
  }, [isMuted, isIframeMounted, iframeLoaded]);

  // Fallback progress bar animation
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.2;
          return next >= duration ? 0 : next;
        });
      }, 200);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, duration]);

  // Universal custom global unmuting mechanism
  useEffect(() => {
    const handleGlobalUnmute = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent && customEvent.detail && customEvent.detail.id !== reel.id) {
        setIsMuted(true);
      }
    };
    window.addEventListener("unmute-reel", handleGlobalUnmute);
    return () => {
      window.removeEventListener("unmute-reel", handleGlobalUnmute);
    };
  }, [reel.id]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setVideoReadyToFade(true);
  };

  // Toggle Mute
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const targetMute = !isMuted;
    setIsMuted(targetMute);
    (window as any).__userHasUnmutedReels = !targetMute;

    if (!targetMute) {
      window.dispatchEvent(new CustomEvent("unmute-reel", { detail: { id: reel.id } }));
    }
  };

  return (
    <div
      ref={containerRef}
      data-reel-id={reel.id}
      style={{ scrollSnapStop: 'always', touchAction: 'pan-x pan-y pinch-zoom' }}
      className={`LookReelCard w-[80%] sm:w-[260px] lg:w-full h-auto sm:h-[58vh] md:h-[62vh] max-h-[460px] min-h-[300px] aspect-[9/16] flex-none snap-center snap-always touch-pan-x touch-pan-y rounded-[16px] overflow-hidden bg-black relative group transition-all duration-500 select-none border-0 outline-none pointer-events-auto
        ${isActive 
          ? "shadow-[0_12px_30px_rgba(200,169,107,0.18)] scale-[1.01] sm:scale-100" 
          : "shadow-[0_8px_25px_rgba(0,0,0,0.03)] opacity-90"
        }
        hover:scale-[1.025] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(200,169,107,0.22)]
        active:scale-[0.985] active:duration-100
      `}
    >
      {/* 1. Dynamic Video IFrame (Buffered/Loaded on Visibility) */}
      {isIframeMounted && (
        <div 
          className="video-wrapper absolute inset-0 w-full h-full bg-black z-0 overflow-hidden pointer-events-none rounded-[16px] border-0 m-0 p-0"
          style={{ pointerEvents: 'none' }}
        >
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&fs=0&disablekb=1&origin=${encodeURIComponent(window.location.origin || '')}`}
            className="absolute pointer-events-none select-none"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            onLoad={handleIframeLoad}
            title={reel.title}
            tabIndex={-1}
            aria-hidden="true"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          />
        </div>
      )}

      {/* 2. Premium Image Poster Fallbacks (Guards against black flashing before buffer) */}
      <div
        className={`absolute inset-0 w-full h-full z-5 pointer-events-none transition-opacity duration-500 ease-in-out ${
          videoReadyToFade ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
        }`}
      >
        <img
          src={reel.poster}
          alt={reel.title}
          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>

      {/* 3. Small Trending badge overlay */}
      <span className="absolute top-3 left-3 bg-[#FAF6F0]/90 backdrop-blur-md text-[#2b2b2b] border border-[#C8A96B]/20 px-2.5 py-0.5 rounded-full text-[8.5px] font-bold tracking-wider uppercase z-30 shadow-sm pointer-events-none select-none">
        {reel.badge || "Trending"}
      </span>

      {/* 4. Complete Silent Protective Overlay to completely absorb all touch elements and prevent native YT interaction/overlays on mobile, whilst bubbling standard scroll container swipe events */}
      <div 
        className="absolute inset-0 w-full h-full z-20 select-none border-0 m-0 p-0"
        style={{ 
          background: 'rgba(0, 0, 0, 0.001)', // Semi-opaque browser rendering layer to forcefully block all interactions and prevent native YouTube play/pause toggling overlays
          pointerEvents: 'auto', 
          touchAction: 'pan-x pan-y pinch-zoom' 
        }}
      />

      {/* 5. Bottom info/controls layout */}
      <div className="absolute bottom-3.5 left-3.5 right-3.5 z-40 flex items-center justify-between pointer-events-none">
        {/* Unmute/Mute toggle */}
        <button
          onClick={handleToggleMute}
          className="pointer-events-auto w-5 h-5 flex items-center justify-center bg-black/10 hover:bg-black/20 text-white/90 rounded-full backdrop-blur-[1px] border border-white/5 shadow transition-all duration-300 hover:scale-105 active:scale-95"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={9} strokeWidth={2} /> : <Volume2 size={9} strokeWidth={2} />}
        </button>

        {/* Shop Now pill redirects */}
        <Link
          to="/shop"
          onClick={(e) => e.stopPropagation()} // Prevents toggling video playback when clicking link
          className="pointer-events-auto inline-flex items-center gap-1.5 text-[8.5px] md:text-[9.5px] text-white bg-black/25 hover:bg-[#C8A96B] hover:border-[#C8A96B]/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm transition-all duration-300"
        >
          <span className="font-sans font-semibold uppercase tracking-wider">Shop Now</span>
          <ArrowRight size={9} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 6. Slim Elegant Progress Bar - Premium mobile style (Expanding gold metallic gradient bar with subtle glow) */}
      <div 
        className={`absolute bottom-0 left-0 w-full z-40 overflow-hidden pointer-events-none transition-all duration-300 ease-in-out
          ${isActive ? "h-[2.5px]" : "h-[1.5px]"} 
          group-hover:h-[4px] bg-white/[0.08] backdrop-blur-[0.5px]`}
      >
        <div
          className="h-full bg-gradient-to-r from-[#EEDDBD] via-[#C8A96B] to-[#B08F52] shadow-[0_0_8px_rgba(200,169,107,0.85)] transition-all duration-[200ms] ease-linear"
          style={{ width: `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%` }}
        />
      </div>
    </div>
  );
}

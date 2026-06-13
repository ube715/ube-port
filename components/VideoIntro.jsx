"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import CinematicLayer from './CinematicLayer';
import styles from '../styles/VideoIntro.module.css';

export default function VideoIntro() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const videoSrc = `${basePath}/VIDEO-2026-05-31-16-58-28.mp4`;
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const textRef = useRef(null);
  const videoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const heroRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);
  const audioAnalyserRef = useRef(null);
  const fallbackNodesRef = useRef(null);
  const soundCheckTimerRef = useRef(null);

  const playSafely = async (video) => {
    if (!video) return false;
    try {
      await video.play();
      return true;
    } catch {
      return false;
    }
  };

  const stopFallbackSound = () => {
    const nodes = fallbackNodesRef.current;
    if (!nodes) return;
    nodes.oscillators.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // Ignore already-stopped oscillators.
      }
    });
    fallbackNodesRef.current = null;
  };

  const scheduleSoundCheck = () => {
    if (soundCheckTimerRef.current) {
      clearTimeout(soundCheckTimerRef.current);
    }
    soundCheckTimerRef.current = window.setTimeout(() => {
      const primary = videoRef.current;
      const analyser = audioAnalyserRef.current;
      const context = audioContextRef.current;
      if (!primary || !context || !analyser || primary.muted || primary.paused || fallbackNodesRef.current) return;

      const samples = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(samples);
      const peak = Math.max(...samples);
      if (peak > 0) return;

      const oscillatorA = context.createOscillator();
      const oscillatorB = context.createOscillator();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();

      oscillatorA.type = 'sine';
      oscillatorA.frequency.value = 55;
      oscillatorB.type = 'triangle';
      oscillatorB.frequency.value = 110;
      filter.type = 'lowpass';
      filter.frequency.value = 420;
      gain.gain.value = 0.008;

      oscillatorA.connect(filter);
      oscillatorB.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      oscillatorA.start();
      oscillatorB.start();
      fallbackNodesRef.current = { oscillators: [oscillatorA, oscillatorB], filter, gain };
    }, 900);
  };

  const ensureAudioPipeline = async () => {
    const primary = videoRef.current;
    if (!primary) return null;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    let context = audioContextRef.current;
    if (!context) {
      context = new AudioContextClass();
      audioContextRef.current = context;
      const source = context.createMediaElementSource(primary);
      audioSourceRef.current = source;
      const analyser = context.createAnalyser();
      const gain = context.createGain();
      analyser.fftSize = 2048;
      gain.gain.value = 1;
      source.connect(analyser);
      source.connect(gain);
      gain.connect(context.destination);
      audioAnalyserRef.current = analyser;
    }

    if (context.state === 'suspended') {
      await context.resume();
    }

    stopFallbackSound();
    scheduleSoundCheck();
    return context;
  };

  const syncAmbientToPrimary = () => {
    const primary = videoRef.current;
    const ambient = bgVideoRef.current;
    if (!primary || !ambient) return;
    const drift = Math.abs((ambient.currentTime || 0) - (primary.currentTime || 0));
    if (drift > 0.08 && primary.readyState > 0 && ambient.readyState > 0) {
      try {
        ambient.currentTime = primary.currentTime || 0;
      } catch {
        // Ignore sync errors until both streams are seekable.
      }
    }
    if (ambient.playbackRate !== primary.playbackRate) {
      ambient.playbackRate = primary.playbackRate;
    }
  };

  useEffect(() => {
    if (!textRef.current || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const elements = heroRef.current.querySelectorAll('[data-animate]');
      gsap.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' });
      gsap.fromTo(
        elements,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
      );
    }, heroRef);

    const timer = setTimeout(() => setShowHint(false), 4200);
    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const primary = videoRef.current;
    if (!primary) return;
    primary.muted = isMuted;
    primary.defaultMuted = isMuted;
    primary.volume = 1;
  }, [isMuted]);

  useEffect(() => {
    const primary = videoRef.current;
    const ambient = bgVideoRef.current;
    if (!primary || !ambient) return undefined;

    ambient.muted = true;
    ambient.volume = 0;

    const sync = () => {
      syncAmbientToPrimary();
      setIsPlaying(!primary.paused && !primary.ended);
    };
    const onPlay = async () => {
      syncAmbientToPrimary();
      await playSafely(ambient);
      await ensureAudioPipeline();
      setIsPlaying(true);
    };
    const onPause = () => {
      ambient.pause();
      if (soundCheckTimerRef.current) {
        clearTimeout(soundCheckTimerRef.current);
      }
      audioContextRef.current?.suspend();
      stopFallbackSound();
      setIsPlaying(false);
    };
    const onLoaded = async () => {
      syncAmbientToPrimary();
      if (!primary.paused) {
        await playSafely(ambient);
        await ensureAudioPipeline();
      }
      setIsPlaying(!primary.paused && !primary.ended);
    };

    primary.addEventListener('play', onPlay);
    primary.addEventListener('playing', onPlay);
    primary.addEventListener('pause', onPause);
    primary.addEventListener('seeking', sync);
    primary.addEventListener('seeked', sync);
    primary.addEventListener('timeupdate', sync);
    primary.addEventListener('ratechange', sync);
    primary.addEventListener('loadedmetadata', onLoaded);
    primary.addEventListener('loadeddata', onLoaded);
    sync();

    return () => {
      primary.removeEventListener('play', onPlay);
      primary.removeEventListener('playing', onPlay);
      primary.removeEventListener('pause', onPause);
      primary.removeEventListener('seeking', sync);
      primary.removeEventListener('seeked', sync);
      primary.removeEventListener('timeupdate', sync);
      primary.removeEventListener('ratechange', sync);
      primary.removeEventListener('loadedmetadata', onLoaded);
      primary.removeEventListener('loadeddata', onLoaded);
      if (soundCheckTimerRef.current) {
        clearTimeout(soundCheckTimerRef.current);
      }
      stopFallbackSound();
      audioContextRef.current?.close();
    };
  }, []);

  const togglePlay = async () => {
    const primary = videoRef.current;
    const ambient = bgVideoRef.current;
    if (!primary || !ambient) return;
    if (!primary.paused) {
      primary.pause();
      ambient.pause();
      if (soundCheckTimerRef.current) {
        clearTimeout(soundCheckTimerRef.current);
      }
      stopFallbackSound();
      await audioContextRef.current?.suspend();
      setIsPlaying(false);
    } else {
      syncAmbientToPrimary();
      const playedPrimary = await playSafely(primary);
      if (playedPrimary) {
        await playSafely(ambient);
        await ensureAudioPipeline();
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }
    setShowHint(false);
  };

  const toggleMute = async () => {
    const primary = videoRef.current;
    if (!primary) return;
    const nextMuted = !primary.muted;
    primary.muted = nextMuted;
    primary.defaultMuted = nextMuted;
    primary.volume = 1;
    if (!nextMuted) {
      await ensureAudioPipeline();
      if (primary.paused) {
        const played = await playSafely(primary);
        if (played) {
          setIsPlaying(true);
        }
      }
    } else {
      if (soundCheckTimerRef.current) {
        clearTimeout(soundCheckTimerRef.current);
      }
      stopFallbackSound();
      await audioContextRef.current?.suspend();
    }
    setIsMuted(nextMuted);
    setShowHint(false);
  };

  const scrollToNext = () => {
    const section = document.getElementById('resume-section');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.heroSection} ref={heroRef}>
      <div className={styles.videoBackground}>
        <video
          ref={bgVideoRef}
          className={styles.ambientVideo}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setIsLoaded(true)}
        />
        <div className={styles.cinematicOverlay} />
        <div className={styles.backgroundOverlay} />
      </div>

      <div className={styles.videoForeground}>
        <video
          ref={videoRef}
          className={styles.mainVideo}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onLoadedData={() => setIsLoaded(true)}
        />
      </div>

      <div className={styles.glowLayer} />
      {!isLoaded && <div className={styles.loadingVeil} aria-hidden="true" />}

      <CinematicLayer />

      <div className={styles.content} ref={textRef}>
        <span className={styles.tagline} data-animate>Information Technology Undergraduate</span>
        <h1 className={styles.title} data-animate>UBENDIRAN<br />GOPALAKRISHNAN</h1>
        <p className={styles.subtitle} data-animate>
          Full stack and software development enthusiast focused on modern web experiences, scalable applications, and impactful digital products.
        </p>
      </div>

      <div className={styles.buttonRow} data-animate>
        {showHint && <span className={styles.hint}>Tap for sound</span>}
        <button className={styles.glassButton} onClick={toggleMute} aria-pressed={!isMuted}>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button className={styles.glassButton} onClick={togglePlay} aria-pressed={!isPlaying}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      <button className={styles.scrollIndicator} onClick={scrollToNext} aria-label="Scroll to next section" data-animate>
        <span className={styles.pulseLine} />
      </button>
    </section>
  );
}

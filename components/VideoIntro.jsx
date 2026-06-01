"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import CinematicLayer from './CinematicLayer';
import styles from '../styles/VideoIntro.module.css';

export default function VideoIntro() {
  const videoSrc = '/VIDEO-2026-05-31-16-58-31.mp4';
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const textRef = useRef(null);
  const videoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const heroRef = useRef(null);

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

  const togglePlay = () => {
    const primary = videoRef.current;
    const ambient = bgVideoRef.current;
    if (!primary || !ambient) return;
    if (isPlaying) {
      primary.pause();
      ambient.pause();
    } else {
      void primary.play();
      void ambient.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const primary = videoRef.current;
    const ambient = bgVideoRef.current;
    if (!primary || !ambient) return;
    const nextMuted = !isMuted;
    primary.muted = nextMuted;
    ambient.muted = nextMuted;
    setIsMuted(nextMuted);
    setShowHint(false);
  };

  const scrollToNext = () => {
    const section = document.getElementById('next-section');
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
        />
      </div>

      <div className={styles.glowLayer} />
      {!isLoaded && <div className={styles.loadingVeil} aria-hidden="true" />}

      <CinematicLayer />

      <div className={styles.content} ref={textRef}>
        <span className={styles.tagline} data-animate>Information Technology Undergraduate</span>
        <h1 className={styles.title} data-animate>UBENDIRAN<br />GOPALAKRISHNAN</h1>
        <p className={styles.subtitle} data-animate>Building modern web experiences, scalable applications, and impactful digital products.</p>

        <div className={styles.resumeCard} data-animate>
          <div className={styles.resumeItem}>
            <span className={styles.resumeLabel}>Education</span>
            <p className={styles.resumeValue}>B.Tech Information Technology (2022–2026) · CGPA 8.33</p>
          </div>
          <div className={styles.resumeItem}>
            <span className={styles.resumeLabel}>Skills</span>
            <p className={styles.resumeValue}>React, Next.js, Three.js, GSAP, HTML/CSS, JavaScript, SQL, Node.js, GraphQL, UI/UX.</p>
          </div>
          <div className={styles.resumeItem}>
            <span className={styles.resumeLabel}>Internship Experience</span>
            <p className={styles.resumeValue}>Software Development Intern · Worked on responsive UI components, API integrations, and frontend performance optimization.</p>
          </div>
          <div className={styles.resumeItem}>
            <span className={styles.resumeLabel}>Projects</span>
            <p className={styles.resumeValue}>Cinematic AI portfolio, modern web applications, and scalable full-stack product prototypes.</p>
          </div>
          <div className={styles.resumeItem}>
            <span className={styles.resumeLabel}>Interests</span>
            <p className={styles.resumeValue}>Cinematic motion design, immersive interfaces, premium frontend engineering, and digital product storytelling.</p>
          </div>
        </div>
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

"use client";

import { useEffect, useRef } from 'react';

export default function ResumeFlow() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const scope = sectionRef.current;
    if (!scope) return;

    const items = Array.from(scope.querySelectorAll('[data-reveal-item]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.22,
      }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="resumeScroll" id="resume-section" ref={sectionRef}>
      <div className="resumeHeader revealItem is-visible">
        <p className="resumeKicker">Portfolio Resume</p>
        <h2>UBENDIRAN GOPALAKRISHNAN</h2>
        <p className="resumeContact">
          Puducherry, India ■ ubendiran18@gmail.com ■ +91 96291 79847 ■ linkedin.com/in/ubendiran-gopala-krishnan-0463b9371
        </p>
      </div>

      <div className="resumeFlow">
        <article className="resumeBlock revealItem" data-reveal-item>
          <h3>PROFESSIONAL SUMMARY</h3>
          <p>
            Information Technology undergraduate with hands-on experience in full stack development and a strong foundation in software programming and database management. Known for a curious mindset, continuous learning, and effective collaboration in team environments. Seeking opportunities as a Web or Software Development Intern.
          </p>
        </article>

        <article className="resumeBlock revealItem" data-reveal-item>
          <h3>EDUCATION</h3>
          <ul>
            <li>
              <strong>B.Tech in Information Technology</strong> · Sri Manakula Vinayagar Engineering College, Puducherry <span>2022 – 2026</span>
              <p>CGPA: 8.33 (Current)</p>
            </li>
            <li>
              <strong>Higher Secondary Certificate (HSC)</strong> · Achariya Siksha Mandir, Puducherry <span>2020 – 2021</span>
              <p>Percentage: 68%</p>
            </li>
          </ul>
        </article>

        <article className="resumeBlock revealItem" data-reveal-item>
          <h3>TECHNICAL SKILLS</h3>
          <ul>
            <li><strong>Programming Languages:</strong> C, Python, Java (Basic)</li>
            <li><strong>Web Technologies:</strong> React, HTML5, CSS3, Flask, Node.js, Python, GraphQL, REST API</li>
            <li><strong>Databases:</strong> SQL, PL/SQL</li>
            <li><strong>Other Skills:</strong> UI/UX Design Principles, Linux (Basics)</li>
          </ul>
        </article>

        <article className="resumeBlock revealItem" data-reveal-item>
          <h3>INTERNSHIP EXPERIENCE</h3>
          <ul>
            <li>
              <strong>Web Development Intern</strong> · Qtech Industry
              <p>Built responsive and interactive user interfaces using HTML, CSS, and JavaScript.</p>
              <p>Worked on front-end development and UI optimization for web applications.</p>
              <p>Performed SQL database operations including queries and data management.</p>
              <p>Collaborated with cross-functional teams to deliver reliable web solutions.</p>
            </li>
            <li>
              <strong>Basics of Linux Operations Intern</strong> · Anna University
              <p>Gained understanding of Linux architecture and file system structure.</p>
              <p>Practiced shell commands and basic system administration tasks.</p>
            </li>
          </ul>
        </article>

        <article className="resumeBlock revealItem" data-reveal-item>
          <h3>PROJECTS</h3>
          <ul>
            <li>
              <strong>Mathematical Expression Solver using AI</strong>
              <p>
                Developed a Python-based application to parse and compute mathematical expressions using basic natural language processing and symbolic logic, with emphasis on step-by-step solution generation.
              </p>
            </li>
            <li>
              <strong>Post-Quantum Encrypted and Identity-Obfuscated Voice Communication System</strong>
              <p>Addressed vulnerabilities of classical encryption (RSA, ECC) against future quantum attacks.</p>
              <p>Designed methods to obfuscate voice metadata such as pitch, tone, and speed.</p>
              <p>Focused on protecting against AI-powered attacks like voice cloning and speaker profiling.</p>
              <p>Proposed a system combining real-time post-quantum cryptography, metadata encryption, and voice obfuscation.</p>
            </li>
          </ul>
        </article>

        <article className="resumeBlock revealItem" data-reveal-item>
          <h3>INTERESTS</h3>
          <p>Web Development, Software Engineering, UI/UX Design, Automation Tools, React.js</p>
        </article>
      </div>
    </section>
  );
}

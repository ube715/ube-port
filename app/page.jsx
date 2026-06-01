import VideoIntro from '../components/VideoIntro';
import './globals.css';

export default function Home() {
  return (
    <main>
      <VideoIntro />
      <section className="nextSection" id="next-section">
        <div className="sectionInner">
          <h2>Next Section</h2>
          <p>
            This is the next section after the cinematic hero. The portfolio page continues with additional content
            and experience details.
          </p>
        </div>
      </section>

      <section className="resumeSection" id="resume">
        <div className="sectionInner">
          <h2>UBENDIRAN GOPALAKRISHNAN</h2>
          <p>Puducherry, India</p>
          <p>ubendiran18@gmail.com ■ +91 96291 79847 ■ <a href="https://linkedin.com/in/ubendiran-gopala-krishnan-0463b9371" target="_blank" rel="noreferrer">LinkedIn</a></p>

          <h3>Professional Summary</h3>
          <p>
            Information Technology undergraduate with hands-on experience in full stack development and a strong
            foundation in software programming and database management. Seeking opportunities as a Web or Software
            Development Intern.
          </p>

          <h3>Education</h3>
          <p><strong>B.Tech in Information Technology</strong> — Sri Manakula Vinayagar Engineering College, Puducherry (2022–2026). CGPA: 8.33 (Current)</p>
          <p><strong>Higher Secondary Certificate (HSC)</strong> — Achariya Siksha Mandir, Puducherry (2020–2021). Percentage: 68%</p>

          <h3>Technical Skills</h3>
          <ul>
            <li><strong>Programming Languages:</strong> C, Python, Java (Basic)</li>
            <li><strong>Web Technologies:</strong> React, HTML5, CSS3, Flask, Node.js, GraphQL, REST API</li>
            <li><strong>Databases:</strong> SQL, PL/SQL</li>
            <li><strong>Other:</strong> UI/UX Design Principles, Linux (Basics)</li>
          </ul>

          <h3>Internship Experience</h3>
          <p><strong>Web Development Intern</strong> — Qtech Industry</p>
          <ul>
            <li>Built responsive and interactive user interfaces using HTML, CSS, and JavaScript.</li>
            <li>Worked on front-end development and UI optimization for web applications.</li>
            <li>Performed SQL database operations including queries and data management.</li>
            <li>Collaborated with cross-functional teams to deliver reliable web solutions.</li>
          </ul>

          <p><strong>Basics of Linux Operations Intern</strong> — Anna University</p>
          <ul>
            <li>Gained understanding of Linux architecture and file system structure.</li>
            <li>Practiced shell commands and basic system administration tasks.</li>
          </ul>

          <h3>Projects</h3>
          <p><strong>Mathematical Expression Solver using AI</strong> — Developed a Python-based application to parse and compute mathematical expressions using basic NLP and symbolic logic, emphasizing step-by-step solution generation.</p>
          <p><strong>Post-Quantum Encrypted and Identity-Obfuscated Voice Communication System</strong></p>
          <ul>
            <li>Addressed vulnerabilities of classical encryption (RSA, ECC) against future quantum attacks.</li>
            <li>Designed methods to obfuscate voice metadata such as pitch, tone, and speed.</li>
            <li>Focused on protecting against AI-powered attacks like voice cloning and speaker profiling.</li>
            <li>Proposed a system combining real-time post-quantum cryptography, metadata encryption, and voice obfuscation.</li>
          </ul>

          <h3>Interests</h3>
          <p>Web Development, Software Engineering, UI/UX Design, Automation Tools, React.js</p>
        </div>
      </section>
    </main>
  );
}

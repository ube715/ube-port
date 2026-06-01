import './globals.css';

export const metadata = {
  title: 'Cinematic Portfolio',
  description: 'A cinematic portfolio hero section with video, Three.js overlay, and premium motion.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

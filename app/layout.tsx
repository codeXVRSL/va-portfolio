import type { Metadata } from 'next';
import { Instrument_Serif, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Shell from './components/Shell';

const display = Instrument_Serif({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Space_Grotesk({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Jamaica Tinguha — Social Media Manager & Content Creator',
  description:
    'Portfolio of Jamaica Tinguha — Social Media Manager, Content Creator, and Virtual Assistant helping real estate professionals, growing brands, and busy entrepreneurs grow online.',
  openGraph: {
    title: 'Jamaica Tinguha — Social Media Manager & Content Creator',
    description:
      'Social media that turns followers into clients. Strategy, content, short-form video, and reliable VA support.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}

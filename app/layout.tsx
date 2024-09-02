import './globals.css';
import { ReactNode } from 'react';
import Head from 'next/head';

export const metadata = {
  title: 'Ferdinand - Your Running Coach',
  description: 'Get personalized motivational text for your running sessions.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <Head>
        <meta property="og:title" content="Ferdinand - Your Running Coach" />
        <meta property="og:description" content="Get personalized motivational texts for your running sessions with Ferdinand, your running coach." />
        <meta property="og:image" content="/header.png" />
        <meta property="og:url" content="https://coachferdinand.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ferdinand - Your Running Coach" />
        <meta name="twitter:description" content="Get personalized motivational texts for your running sessions with Ferdinand, your running coach." />
        <meta name="twitter:image" content="/header.png" />
        <meta name="twitter:url" content="https://coachferdinand.vercel.app/" />
      </Head>
      <body>
        {children}
      </body>
    </html>
  );
}

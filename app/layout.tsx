import './globals.css';
import { ReactNode } from 'react';

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
      <body>{children}</body>
    </html>
  );
}

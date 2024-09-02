import './globals.css';

export const metadata = {
  title: 'Ferdinand - Your Running Coach',
  description: 'Get personalized motivational text for your running sessions.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

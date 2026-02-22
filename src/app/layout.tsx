import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Courtside Pro Scoreboard',
  description: 'Live basketball scoreboard controller and display system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased text-white bg-[#0a0a0f]">
        {children}
      </body>
    </html>
  );
}

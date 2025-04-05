import type { Metadata } from "next";
import { K2D } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const k2d = K2D({
  variable: "--font-k2d",
  weight: ["200", "400", "600", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Manager",
  description: "An event manager application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script 
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />
      </head>
      <body className={k2d.variable}>
        {children}
      </body>
    </html>
  );
}

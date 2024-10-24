import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Auth from "./Auth";
// import Header from "@/components/shared/Header";
// import { ChakraProvider } from "@chakra-ui/react";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Quora Clone App",
  description: "This is a Quora clone app which is has similar features with Quara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Auth />
          {children}
        </Providers>
      </body>
    </html>
  );
}

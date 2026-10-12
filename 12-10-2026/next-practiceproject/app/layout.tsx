import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Providers from "./providers";
import Navbar from "./src/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Multipage Next.js application",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background-secondary text-foreground">
      
      <Navbar/>

        {/* Page content */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
          <div className="rounded-2xl border border-border bg-background-card p-6 shadow-sm sm:p-8">
            <Providers>{children}</Providers>
          </div>
        </main>

        {/* Footer: dark navy with light text */}
        <footer className="bg-background-inverse px-4 py-6 text-center text-sm text-foreground-inverse!">
          © 2026 MyApp. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
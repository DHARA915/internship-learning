
// app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import {Providers}  from './provider'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

// static metaData............................................
// export const metadata: Metadata = {
//   title: "Admit | Event booking",
//   description: "Discover, book and manage events.",
// };

// app/layout.tsx

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", jakarta.variable, "font-sans", geist.variable)}>
      {/* <body className="min-h-screen "> */}
      <body className="min-h-screen w-full overflow-x-clip">

        <Providers>

        {children}
        </Providers>
        </body>
    </html>
  );
}
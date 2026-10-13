import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "./src/components/Navbar";
import AuthGuard from "./src/components/auth-guard";

export const metadata: Metadata = {
  title: "MyApp",
  description: "My app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <AuthGuard>{children}</AuthGuard>
        </Providers>
      </body>
    </html>
  );
}


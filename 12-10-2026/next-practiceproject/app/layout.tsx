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
          {/* <AuthGuard>{children}</AuthGuard> */}
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="min-h-[calc(100dvh-10rem)] rounded-xl border border-border bg-background-card p-4 shadow-sm sm:p-6 lg:p-8">
              <AuthGuard>{children}</AuthGuard>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}

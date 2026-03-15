import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlobalAIChat from "@/components/GlobalAIChat";

export const metadata: Metadata = {
  title: "GFG RIT Campus Hub | GeeksforGeeks Club",
  description: "Official digital hub for the GeeksforGeeks Campus Club at Rajalakshmi Institute of Technology. Events, coding challenges, learning resources, and community.",
  keywords: ["GFG", "GeeksforGeeks", "RIT", "Campus Club", "Coding", "Events", "DSA"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0a0a0f] antialiased">
        <ClientProviders>
          <Navbar />
          <main className="pt-16 min-h-screen">{children}</main>
          <GlobalAIChat />
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}

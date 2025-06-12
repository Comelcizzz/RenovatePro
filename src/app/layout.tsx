import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/lib/auth";
import ClientHeader from "@/components/layout/ClientHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RenovatePro - Transform Your Space with Magic ✨",
  description:
    "Revolutionary renovation and design services that bring your wildest dreams to life with cutting-edge technology and unmatched creativity.",
  keywords:
    "renovation, design, construction, interior design, home improvement, modern renovation",
  authors: [{ name: "RenovatePro Team" }],
  openGraph: {
    title: "RenovatePro - Transform Your Space with Magic ✨",
    description:
      "Revolutionary renovation and design services that bring your wildest dreams to life",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <ClientHeader session={session} />
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
        </div>

        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          />
        </div>
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import TanstackProvider from "@/context/tanstack-provider";
import { Toaster } from "sonner";
import AuthProvider from "@/context/AuthProvider";

const DMSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sociial Admin",
  description:
    "An admin dashboard to manage Sociial platform (a social media platform built over web).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${DMSans.className} antialiased`}>
        <TanstackProvider>
          <AuthProvider>
            <Toaster position="bottom-right" richColors />
            <div className="min-h-screen bg-background">
              <Sidebar />
              <main>{children}</main>
            </div>
          </AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}

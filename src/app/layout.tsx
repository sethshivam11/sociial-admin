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
    "A centralized administrative dashboard built to oversee platform activity, manage content workflows, handle reports, and analyze engagement across posts, videos, and other media — empowering efficient moderation and data-driven decisions",
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Sociial Admin",
    description:
      "A centralized administrative dashboard built to oversee platform activity, manage content workflows, handle reports, and analyze engagement across posts, videos, and other media — empowering efficient moderation and data-driven decisions",
    siteName: "Sociial Admin",
    images: [
      {
        url: "/opengraph-image.jpg",
        type: "image/jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sociial Admin",
    description:
      "A centralized administrative dashboard built to oversee platform activity, manage content workflows, handle reports, and analyze engagement across posts, videos, and other media — empowering efficient moderation and data-driven decisions",
    creator: "@sethshivam11",
    siteId: "765045797750706176",
    images: [
      {
        url: "/opengraph-image.jpg",
        type: "image/jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
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

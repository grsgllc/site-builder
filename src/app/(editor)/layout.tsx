import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { getSEOTags } from "@/lib/metadata";
import { auth, signOut } from "@/lib/auth";
import { createPortalSession } from "@/lib/stripe";
import { UserDetails } from "@/types";
import { redirect } from "next/navigation";
import "./editor.css";

export const metadata = getSEOTags();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) return redirect("/");

  return (
    <html
      lang="en"
      data-theme="saas"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-200 flex flex-col min-h-svh`}
      >
        <main>{children}</main>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}

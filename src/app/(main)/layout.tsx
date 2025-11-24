import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { getSEOTags } from "@/lib/metadata";
import { auth, signOut } from "@/lib/auth";
import { createPortalSession } from "@/lib/stripe";
import { UserDetails } from "@/types";
import { redirect } from "next/navigation";
import "./main.css";

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
  const userId = session?.user?.id || "";

  const handleCreatePortalSession = async () => {
    "use server";
    const url = await createPortalSession(userId);
    redirect(url);
  };

  const handleSignOut = async () => {
    "use server";
    await signOut();
    redirect("/");
  };

  const user: UserDetails | undefined = session?.user
    ? {
        userId: session.user?.id || "",
        email: session.user?.email || "",
        hasAccess: session.user?.hasAccess || false,
        stripeCustomerId: session.user?.stripeCustomerId || "",
        trialExpiresAt: session.user?.trialExpiresAt,
      }
    : undefined;
  return (
    <html
      lang="en"
      data-theme="saas"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-200 flex flex-col min-h-svh`}
      >
        <Header
          user={user}
          signOut={handleSignOut}
          createPortalSession={handleCreatePortalSession}
        />
        <main className="flex-1 p-4">{children}</main>
        <Footer />
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { checkSubdomainAvailable } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const subdomain = req.nextUrl.searchParams.get("subdomain");

    if (!subdomain) {
      return NextResponse.json(
        { message: "Subdomain parameter required" },
        { status: 400 }
      );
    }

    // Validate subdomain format
    const isValid = /^[a-z0-9-]+$/.test(subdomain);
    if (!isValid || subdomain.length < 3) {
      return NextResponse.json({ available: false });
    }

    // Reserved subdomains
    const reserved = [
      "www",
      "api",
      "admin",
      "dashboard",
      "app",
      "mail",
      "ftp",
      "localhost",
      "staging",
      "dev",
      "test",
    ];
    if (reserved.includes(subdomain)) {
      return NextResponse.json({ available: false });
    }

    const available = await checkSubdomainAvailable(subdomain);

    return NextResponse.json({ available });
  } catch (error) {
    console.error("Error checking subdomain:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

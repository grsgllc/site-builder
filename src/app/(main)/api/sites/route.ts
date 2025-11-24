import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createSite,
  createPage,
  checkSubdomainAvailable,
  getAllLayouts,
} from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subdomain, name, description, layoutId } = body;

    if (!subdomain || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if subdomain is available
    const available = await checkSubdomainAvailable(subdomain);
    if (!available) {
      return NextResponse.json(
        { message: "Subdomain not available" },
        { status: 400 }
      );
    }

    // Get default layout if none specified
    let finalLayoutId = layoutId;
    if (!finalLayoutId) {
      const layouts = await getAllLayouts();
      const defaultLayout = layouts.find((l) => l.isDefault);
      finalLayoutId = defaultLayout?.id;
    }

    // Create the site
    const site = await createSite({
      subdomain,
      name,
      description,
      userId: session.user.id,
      layoutId: finalLayoutId,
    });

    // Create a default home page for the site
    await createPage({
      siteId: site.id,
      title: "Home",
      slug: "home",
      isHome: true,
      seoTitle: name,
      seoDescription: description || `Welcome to ${name}`,
    });

    return NextResponse.json(
      {
        message: "Site created successfully",
        site,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating site:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

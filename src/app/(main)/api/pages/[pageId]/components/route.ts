import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getPage,
  createComponent,
  updateComponent,
  deleteComponent,
  bulkUpdateComponents,
} from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pageId } = await params;
    const body = await req.json();
    const {
      type,
      props,
      positionX,
      positionY,
      width,
      height,
      zIndex,
      layoutSection,
    } = body;

    // Verify user has access to this page's site
    const page = await getPage(pageId);
    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    const isOwner = page.site.userId === session.user.id;
    const isCollaborator = page.site.collaborators?.some(
      (c) => c.userId === session.user.id
    );

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const component = await createComponent({
      pageId,
      type,
      props,
      positionX,
      positionY,
      width,
      height,
      zIndex,
      layoutSection,
    });

    return NextResponse.json({ component }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating component:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pageId } = await params;
    const body = await req.json();
    const { components } = body;

    // Verify user has access
    const page = await getPage(pageId);
    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    const isOwner = page.site.userId === session.user.id;
    const isCollaborator = page.site.collaborators?.some(
      (c) => c.userId === session.user.id
    );

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Bulk update components
    await bulkUpdateComponents(components);

    return NextResponse.json({ message: "Components updated" });
  } catch (error: any) {
    console.error("Error updating components:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

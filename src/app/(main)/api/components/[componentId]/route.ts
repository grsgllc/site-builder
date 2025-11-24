import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateComponent, deleteComponent, getPage } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ componentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { componentId } = await params;
    const body = await req.json();

    // Get component and verify access
    const comp = await prisma.component.findUnique({
      where: { id: componentId },
      include: {
        page: {
          include: {
            site: {
              include: {
                collaborators: true,
              },
            },
          },
        },
      },
    });

    if (!comp) {
      return NextResponse.json(
        { message: "Component not found" },
        { status: 404 }
      );
    }

    const isOwner = comp.page.site.userId === session.user.id;
    const isCollaborator = comp.page.site.collaborators.some(
      (c) => c.userId === session.user.id
    );

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const component = await updateComponent(componentId, body);

    return NextResponse.json({ component });
  } catch (error: any) {
    console.error("Error updating component:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ componentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { componentId } = await params;

    // Get component and verify access
    const comp = await prisma.component.findUnique({
      where: { id: componentId },
      include: {
        page: {
          include: {
            site: {
              include: {
                collaborators: true,
              },
            },
          },
        },
      },
    });

    if (!comp) {
      return NextResponse.json(
        { message: "Component not found" },
        { status: 404 }
      );
    }

    const isOwner = comp.page.site.userId === session.user.id;
    const isCollaborator = comp.page.site.collaborators.some(
      (c) => c.userId === session.user.id
    );

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await deleteComponent(componentId);

    return NextResponse.json({ message: "Component deleted" });
  } catch (error: any) {
    console.error("Error deleting component:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

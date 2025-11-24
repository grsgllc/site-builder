import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllLayouts } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const layouts = await getAllLayouts();

    return NextResponse.json(
      {
        layouts,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching layouts:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

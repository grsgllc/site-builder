import { NextResponse } from "next/server";
import { getTemplates } from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await getTemplates();

    return NextResponse.json(
      {
        templates,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

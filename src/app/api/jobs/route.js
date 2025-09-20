import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const params = request.nextUrl.searchParams;
    const category = params.get("category").toUpperCase();

    const jobs = await prisma.job.findMany({
      where: {
        category: {
          name: category,
        },
      },
      include: {
        company: true,
        category: true,
        skills: { include: { skill: true } },
      },
      orderBy: { postedAt: "desc" },
      take: 5,
    });

    return NextResponse.json(
      { success: true, message: "Jobs Fetched", data: jobs },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse(
      { success: false, message: "Unknown issue while fetching jobs" },
      { status: 500 }
    );
  }
}

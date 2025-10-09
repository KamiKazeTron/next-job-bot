import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, education, experience, resume, portfolio } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { education, experience, resume, portfolio },
    });

    return NextResponse.json({ message: "Profile updated", updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function PATCH(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, age, sex, address, phone, education, experience } = body;

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name, age, sex, address, phone, education, experience },
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

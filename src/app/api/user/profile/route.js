import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      age: true,
      sex: true,
      address: true,
      phone: true,
      education: true,
      experience: true,
    },
  });

  return NextResponse.json(user);
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // 🔧 Sanitize and validate input
    const updateData = {
      name: data.name || "",
      age: data.age ? parseInt(data.age, 10) : null, // convert to Int if Prisma expects Int
      sex: data.sex || "",
      address: data.address || "",
      phone: data.phone || "",
      education: data.education || "",
      experience: data.experience || "",
    };

    // 🔒 Do not update email directly (use it to identify the user)
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        name: true,
        email: true,
        age: true,
        sex: true,
        address: true,
        phone: true,
        education: true,
        experience: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

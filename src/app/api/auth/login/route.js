import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import * as bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Login successful", user },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

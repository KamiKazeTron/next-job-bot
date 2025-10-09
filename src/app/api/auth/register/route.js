import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  
  try {
    const body = await req.json();
    console.log("Register API called");
    console.log("Request body:", body);

    const { name, email, password, age, sex, address, phone } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        age: Number(age),
        sex,
        address,
        phone,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "User registration failed" },
      { status: 500 }
    );
  }
}

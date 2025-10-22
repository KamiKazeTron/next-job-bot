import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";

export async function POST(req) {
  try {
    const {
      name,
      email,
      password,
      age,
      sex,
      address,
      phone,
      education,
      experience,
    } = await req.json();
    
    const required = {
      name,
      email,
      password,
      age,
      sex,
      address,
      phone,
      education,
      experience,
    };

    for (const [k, v] of Object.entries(required)) {
      if (
        v === undefined ||
        v === null ||
        (typeof v === "string" && v.trim() === "") ||
        (k === "age" && (!Number.isInteger(Number(v)) || Number(v) <= 0))
      ) {
        return NextResponse.json(
          { error: `Missing or invalid ${k}` },
          { status: 400 }
        );
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        age: parseInt(age) || 0,
        sex,
        address,
        phone,
        education,
        experience,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    if (error.code) console.error("Prisma error code:", error.code);
    if (error.meta) console.error("Prisma meta info:", error.meta);

    return NextResponse.json(
      { error: error.message || "Failed to register user" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

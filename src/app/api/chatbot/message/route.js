import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "../../../../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, message } = body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const prompt = `
      You are an AI that writes professional Upwork job proposals.
      The user details are:
      Name: ${user.name}
      Experience: ${user.experience}
      Education: ${user.education}
      Portfolio: ${user.portfolio}
      Resume: ${user.resume}
      
      Based on this, write a professional response for the job:
      ${message}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get chatbot response" },
      { status: 500 }
    );
  }
}

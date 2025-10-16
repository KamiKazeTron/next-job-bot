import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // correct relative path
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { userId, message } = await req.json();

    // Fetch user details from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { projects: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const context = `
User Details:
Name: ${user.name}
Age: ${user.age}
Sex: ${user.sex}
Address: ${user.address}
Email: ${user.email}
Phone: ${user.phone}
Projects: ${user.projects?.map((p) => p.title).join(", ") || "None"}
Resume: ${user.resume || "Not provided"}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that writes professional Upwork proposals.",
        },
        { role: "user", content: `${context}\n\nUser message: ${message}` },
      ],
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    return NextResponse.json({ response: aiResponse });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}

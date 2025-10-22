// ✅ proposal API (technologies optional)
import prisma from "../../../../lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: "v1",
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const proposals = await prisma.proposal.findMany({
      where: { userId: session.user.id },
      include: { jobOffer: true, project: true },
    });
    return new Response(JSON.stringify(proposals), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch proposals",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userId = session.user.id;

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }

  const { jobOffer } = body;
  if (!jobOffer?.title || !jobOffer?.description) {
    return new Response(
      JSON.stringify({ error: "Missing job offer title or description" }),
      { status: 400 }
    );
  }

  // ✅ Technologies optional
  const technologies =
    Array.isArray(jobOffer.technologies) && jobOffer.technologies.length > 0
      ? jobOffer.technologies
      : [];

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        age: true,
        sex: true,
        education: true,
        experience: true,
        portfolio: true,
      },
    });

    if (!user)
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });

    const newJobOffer = await prisma.jobOffer.create({
      data: {
        title: jobOffer.title,
        description: jobOffer.description,
        technologies: technologies.length > 0 ? technologies : [],
      },
    });

    const prompt = `
      Based on the following job offer:
      Title: ${jobOffer.title}
      Description: ${jobOffer.description}
      Technologies: ${
        technologies.length > 0 ? JSON.stringify(technologies) : "N/A"
      }

      User Profile:
      Name: ${user.name || "Unknown"}
      Age: ${user.age || "N/A"}
      Sex: ${user.sex || "N/A"}
      Education: ${user.education || "N/A"}
      Experience: ${user.experience || "N/A"}
      Portfolio: ${user.portfolio || "N/A"}

      You are a professional Upwork bidder. who wants to bid on this job offer. Write a tailored, professional proposal text for this job offer. Split the proposal into 3 different messages with spacing between them. In the first message ask a question about a problem related to the job offer or a problem that may be faced during the development. In the second message explain how the user would help solve the problem using their experience and skills. In the third message highlight the user's information related to the job offer. Highlight relevant experience, skills, projects and explain why the user is a good fit. Do proper spacing trhough the use of "---" and make sure the proposal is easy to read.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    let generatedText = result.response.text().trim();

    // Replace any '---' (with or without spaces) with a double newline (paragraph break)
    generatedText = generatedText.replace(/\s*---\s*/g, "\n\n");

    const newProposal = await prisma.proposal.create({
      data: {
        userId,
        jobOfferId: newJobOffer.id,
        proposalText: generatedText,
        status: "draft",
      },
    });




    return new Response(JSON.stringify(newProposal), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to create proposal",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

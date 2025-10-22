import prisma from "../../../../lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai"; // ✅ Gemini SDK
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

console.log("=== API Route Loaded ===");
console.log(
  "GEMINI_API_KEY loaded:",
  process.env.GEMINI_API_KEY
    ? `****${process.env.GEMINI_API_KEY.slice(-4)}`
    : "NOT SET"
);

// ✅ Initialize Gemini with v1 API version (stable, supports 2025 models)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: "v1", // ✅ Stable v1 (fixes v1beta 404 errors)
});

export async function GET(request) {
  console.log("🚀 GET /api/user/proposal - START");

  const session = await getServerSession(authOptions);
  console.log("📋 GET Session:", {
    hasSession: !!session,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
  });

  if (!session || !session.user?.id) {
    console.error("❌ GET /api/user/proposal: Unauthorized, no valid session");
    return new Response(
      JSON.stringify({ error: "Unauthorized: No valid session" }),
      { status: 401 }
    );
  }

  const userId = session.user.id;
  console.log("✅ GET User authenticated:", userId);

  try {
    console.log("🔍 GET Fetching proposals for user:", userId);
    const proposals = await prisma.proposal.findMany({
      where: { userId },
      include: {
        jobOffer: true,
        project: true,
      },
    });
    console.log("✅ GET Proposals fetched:", proposals.length);
    return new Response(JSON.stringify(proposals), { status: 200 });
  } catch (error) {
    console.error("💥 GET /api/user/proposal error:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
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
  console.log("🚀 POST /api/user/proposal - START");

  const session = await getServerSession(authOptions);
  console.log("📋 POST Session:", {
    hasSession: !!session,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
  });

  if (!session || !session.user?.id) {
    console.error("❌ POST /api/user/proposal: Unauthorized, no valid session");
    return new Response(
      JSON.stringify({ error: "Unauthorized: No valid session" }),
      { status: 401 }
    );
  }

  const userId = session.user.id;
  console.log("✅ POST User authenticated:", userId);

  let body;
  try {
    console.log("📥 POST Parsing request body...");
    body = await request.json();
    console.log("✅ POST Body parsed:", {
      hasJobOffer: !!body.jobOffer,
      title: body.jobOffer?.title,
      technologiesCount: body.jobOffer?.technologies?.length || 0,
    });
  } catch (error) {
    console.error("💥 POST /api/user/proposal error: Invalid JSON", {
      message: error.message,
      stack: error.stack,
    });
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }

  const { jobOffer } = body;

  console.log("🔍 POST Validating jobOffer:", {
    title: jobOffer?.title,
    description: !!jobOffer?.description,
    technologies: jobOffer?.technologies,
    isArray: Array.isArray(jobOffer?.technologies),
  });

  if (
    !jobOffer ||
    !jobOffer.title ||
    !jobOffer.description ||
    !Array.isArray(jobOffer.technologies)
  ) {
    console.error("❌ POST /api/user/proposal error: Invalid job offer data", {
      jobOffer,
      missingTitle: !jobOffer?.title,
      missingDescription: !jobOffer?.description,
      technologiesType: typeof jobOffer?.technologies,
      isArray: Array.isArray(jobOffer?.technologies),
    });
    return new Response(
      JSON.stringify({ error: "Missing or invalid job offer details" }),
      { status: 400 }
    );
  }

  console.log("✅ POST JobOffer validation passed");

  try {
    console.log("👤 POST Fetching user profile:", userId);
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

    console.log("✅ POST User profile fetched:", {
      name: user?.name,
      age: user?.age,
      hasExperience: !!user?.experience,
    });

    if (!user) {
      console.error("❌ POST /api/user/proposal error: User not found", {
        userId,
      });
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    console.log("💼 POST Creating JobOffer...");
    const newJobOffer = await prisma.jobOffer.create({
      data: {
        title: jobOffer.title,
        description: jobOffer.description,
        technologies: jobOffer.technologies,
      },
    });

    console.log("✅ POST JobOffer created:", {
      id: newJobOffer.id,
      title: newJobOffer.title,
      technologiesCount: newJobOffer.technologies.length,
    });

    const prompt = `
      Based on the following job offer:
      Title: ${jobOffer.title}
      Description: ${jobOffer.description}
      Technologies: ${JSON.stringify(jobOffer.technologies)}

      And the user's profile:
      Name: ${user.name || "Unknown"}
      Age: ${user.age || "N/A"}
      Sex: ${user.sex || "N/A"}
      Education: ${user.education || "N/A"}
      Experience: ${user.experience || "N/A"}
      Portfolio: ${user.portfolio || "N/A"}

      Write a tailored, professional proposal text for this job offer. The proposal should consist of mainly 3 portions. In the first portion ask any random question about a problem related to the job offer. In the second portion explain how the user would help solve the problem using their experience and skills. In the third portion highlight the user's information related to the job offer. Keep it concise, highlight relevant experience and skills, and explain why the user is a good fit.
    `;

    // ✅ GEMINI API CALL (updated for 2025 models)
    console.log("🤖 POST Calling GEMINI API...");
    console.log(
      "🔑 GEMINI API Key ends with:",
      process.env.GEMINI_API_KEY?.slice(-4) || "NOT SET"
    );
    console.log("📝 Prompt length:", prompt.length);

    let generatedText;
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables");
      }

      // ✅ Use 2025 stable model (Gemini 2.5 Flash - fast and available)
      const modelName = "gemini-2.5-flash"; // ✅ Current stable model (no suffix needed)
      const model = genAI.getGenerativeModel({ model: modelName });

      // ✅ Generate content
      const result = await model.generateContent(prompt);
      generatedText = result.response.text().trim();

      console.log("✅ POST GEMINI API success:", {
        model: modelName,
        hasContent: !!generatedText,
        contentLength: generatedText?.length,
        first50: generatedText?.slice(0, 50),
      });

      if (!generatedText) {
        throw new Error("No content returned from Gemini API");
      }
    } catch (error) {
      console.error("💥 POST /api/user/proposal GEMINI API FAILED:", {
        message: error.message,
        status: error.status,
        responseData: error.response?.data || error.cause,
        apiKeySnippet: process.env.GEMINI_API_KEY?.slice(-4),
        stack: error.stack,
      });
      let errorMessage = "Failed to generate proposal text";
      if (error.message.includes("401") || error.message.includes("invalid")) {
        errorMessage =
          "Invalid Gemini API key. Please check your API key configuration.";
      } else if (
        error.message.includes("429") ||
        error.message.includes("quota")
      ) {
        errorMessage =
          "Gemini API rate limit exceeded. Please try again later.";
      } else if (
        error.message.includes("404") ||
        error.message.includes("not found")
      ) {
        errorMessage =
          "Gemini model not available. Try 'gemini-2.5-pro' or check Google AI Studio for updates.";
      } else {
        errorMessage = `Gemini API error: ${error.message}`;
      }
      return new Response(
        JSON.stringify({ error: errorMessage, details: error.message }),
        { status: 500 }
      );
    }

    console.log("📄 POST Creating Proposal...");
    const newProposal = await prisma.proposal.create({
      data: {
        userId,
        jobOfferId: newJobOffer.id,
        proposalText: generatedText,
        status: "draft",
      },
    });

    console.log("🎉 POST Proposal created successfully:", {
      id: newProposal.id,
      status: newProposal.status,
      textLength: newProposal.proposalText.length,
    });

    return new Response(JSON.stringify(newProposal), { status: 201 });
  } catch (error) {
    console.error("💥 POST /api/user/proposal FINAL ERROR:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      meta: error.meta,
    });
    return new Response(
      JSON.stringify({
        error: "Failed to create proposal",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

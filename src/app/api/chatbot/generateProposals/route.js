import prisma from "../../../lib/prisma";
import { verifyTokenFromReq } from "../../_utils";

export default async function handler(req, res) {
  // This endpoint receives { jobDescription: string } from the client
  // It reads the logged-in user's data and uses OpenAI to return a generated proposal.
  if (req.method !== "POST") return res.status(405).end();

  const userPayload = verifyTokenFromReq(req);
  if (!userPayload) return res.status(401).json({ error: "Unauthorized" });

  const userId = userPayload.id;
  const { jobDescription } = req.body;

  try {
    // Fetch user + projects
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { projects: true },
    });

    // Build prompt for LLM
    const prompt = `
You are an assistant that writes professional Upwork proposals.
User profile:
Name: ${user.name}
Email: ${user.email}
Age: ${user.age}
Sex: ${user.sex}
Address: ${user.address}
Phone: ${user.phone}
Education: ${user.education || "N/A"}
Experience: ${user.experience || "N/A"}
Projects: ${
      user.projects.map((p) => `- ${p.title}: ${p.description}`).join("\n") ||
      "None"
    }

Job posting:
${jobDescription}

Write a concise, persuasive Upwork proposal tailored to the job posting and the user's profile. Include: opening sentence, relevant experience, 1-2 examples from user's projects, brief approach, timeline, and call-to-action.
`;

    // --- Call OpenAI REST API (example). Replace with your OpenAI key and endpoint.
    // For now we provide a placeholder response so you can test locally.
    // To enable real OpenAI calls, uncomment the fetch code below and set OPENAI_API_KEY in .env

    // const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-4o-mini",
    //     messages: [{ role: "user", content: prompt }],
    //     max_tokens: 600
    //   })
    // });
    // const openaiData = await openaiRes.json();
    // const proposal = openaiData.choices?.[0]?.message?.content || "No response from model";

    // Placeholder response:
    const proposal = `Hello,\n\nI’m ${
      user.name
    } — an experienced developer with relevant experience that matches your job posting. ${
      user.experience || ""
    } I have worked on projects such as ${
      user.projects
        .slice(0, 2)
        .map((p) => p.title)
        .join(", ") || "several relevant projects"
    } which involved similar tasks. My approach will be to first analyze your requirements, propose a short milestone plan, and deliver a working prototype within X days. I’d love to discuss the details. Thanks for considering my proposal.\n\nRegards,\n${
      user.name
    }`;

    return res.json({ proposal });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate proposal" });
  }
}

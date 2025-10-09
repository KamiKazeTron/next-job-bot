import prisma from "../../../lib/prisma";
import { verifyTokenFromReq } from "../../_utils";

export default async function handler(req, res) {
  const userPayload = verifyTokenFromReq(req);
  if (!userPayload) return res.status(401).json({ error: "Unauthorized" });

  const userId = userPayload.id;

  if (req.method === "GET") {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ projects });
  }

  if (req.method === "POST") {
    const { title, description, image } = req.body;
    try {
      const project = await prisma.project.create({
        data: { userId, title, description, image },
      });
      return res.status(201).json({ project });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create project" });
    }
  }

  return res.status(405).end();
}

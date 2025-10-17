import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../lib/prisma"; // Adjust path to your lib/prisma.js

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch projects" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    const { title, description, technologies, githubUrl, liveUrl, image } =
      body;
    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        title,
        description,
        technologies: JSON.parse(technologies), // Expect stringified array from client
        githubUrl,
        liveUrl,
        image,
      },
    });
    return new Response(JSON.stringify(project), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create project" }), {
      status: 500,
    });
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    const { id, title, description, technologies, githubUrl, liveUrl, image } =
      body;
    const project = await prisma.project.update({
      where: { id, userId: session.user.id }, // Ensure ownership
      data: {
        title,
        description,
        technologies: JSON.parse(technologies),
        githubUrl,
        liveUrl,
        image,
      },
    });
    return new Response(JSON.stringify(project), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update project" }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await prisma.project.delete({
      where: { id, userId: session.user.id },
    });
    return new Response(JSON.stringify({ message: "Project deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete project" }), {
      status: 500,
    });
  }
}

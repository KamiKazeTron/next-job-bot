import ProjectList from "../../components/ProjectList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session) return <p>Please log in to access your projects</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Manage Your Projects</h1>
      <ProjectList userId={session.user.id} />
    </div>
  );
}

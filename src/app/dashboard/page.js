import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <div style={{ maxWidth: 1000, margin: "30px auto" }}>
      <h2>Dashboard</h2>
      <div style={{ display: "flex", gap: 12 }}>
        <nav style={{ minWidth: 200 }}>
          <ul>
            <li>
              <Link href="/dashboard/profile">Profile</Link>
            </li>
            <li>
              <Link href="/dashboard/projects">Projects</Link>
            </li>
            <li>
              <Link href="/dashboard/proposals">Proposals</Link>
            </li>
          </ul>
        </nav>
        <section style={{ flex: 1 }}>
          <p>Select a section from the left (Profile / Projects / Chatbot)</p>
        </section>
      </div>
    </div>
  );
}

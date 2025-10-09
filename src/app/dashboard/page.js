import Link from "next/link";

export default function Dashboard() {
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
              <Link href="/dashboard/chatbot">Chatbot</Link>
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

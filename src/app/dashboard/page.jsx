import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  return (
    <div className="min-h-screen bg-[#ADD9F4] p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <nav className="min-w-[200px] bg-[#476C9B] text-white rounded-2xl p-6 shadow-lg">
          <ul className="space-y-4">
            {["Profile", "Projects", "Proposals"].map((item) => (
              <li key={item}>
                <Link
                  href={`/dashboard/${item.toLowerCase()}`}
                  className="block px-3 py-2 rounded-lg hover:bg-[#468C98] transition-colors duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <section className="flex-1 bg-[#101419] rounded-2xl p-8 shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {session.user.name}
          </h2>
          <p>Select a section from the left (Profile / Projects / Proposals)</p>
        </section>
      </div>
    </div>
  );
}

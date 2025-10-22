"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  // If loading, you can show a loader
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ADD9F4]">
        <p className="text-[#101419] text-xl">Loading...</p>
      </div>
    );
  }

  // If logged in, show dashboard-style welcome page
  if (session?.user) {
    return (
      <div className="min-h-screen bg-[#ADD9F4] flex items-center justify-center px-4">
        <div className="max-w-xl bg-[#101419] rounded-2xl shadow-lg p-10 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, {session.user.name || session.user.email}!
          </h1>
          <p className="text-white/90 mb-8">
            Go to your dashboard to manage your projects and proposals.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-[#984447] hover:bg-[#476C9B] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, show the normal home page
  return (
    <div className="min-h-screen bg-[#ADD9F4] flex items-center justify-center px-4 m-0">
      <div className="max-w-xl bg-[#101419] rounded-2xl shadow-lg p-10 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Next Job Bot</h1>
        <p className="text-white/90 mb-8">
          Create professional Upwork proposals with AI — tailored from your
          profile and projects.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-[#984447] hover:bg-[#476C9B] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="bg-[#476C9B] hover:bg-[#468C98] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

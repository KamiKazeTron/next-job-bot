import Link from "next/link";

export default function Home() {
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

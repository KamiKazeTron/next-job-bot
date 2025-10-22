"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res.error) setError("Invalid email or password");
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#ADD9F4] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#101419] text-white rounded-2xl shadow-lg p-10 w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-[#476C9B] placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#468C98]"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-[#476C9B] placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#468C98]"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-[#984447] hover:bg-[#468C98] transition-colors duration-200 font-semibold"
        >
          Login
        </button>

        <p className="text-white/80 text-center text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-[#ADD9F4] hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

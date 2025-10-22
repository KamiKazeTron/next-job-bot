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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border w-full p-2 mb-3 rounded"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border w-full p-2 mb-3 rounded"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded">
        Login
      </button>
    </form>
  );
}

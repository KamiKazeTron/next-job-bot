"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios"; // make sure this points to src/lib/axios.js

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/login", form);
      console.log("Login response:", response.data);

      // On success, redirect or show message
      setMessage("Login successful!");
      router.push("/dashboard/chatbot"); // redirect after login
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data?.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow rounded"
    >
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
        className="w-full mb-2 p-2 border rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </form>
  );
}

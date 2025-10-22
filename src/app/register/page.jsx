"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      setSuccess("Account created successfully!");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ADD9F4] flex items-center justify-center px-4 m-0">
      <div className="w-full max-w-md bg-[#101419] rounded-2xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {[
            "name",
            "email",
            "password",
            "age",
            "sex",
            "address",
            "phone",
            "education",
            "experience",
            "resume",
            "portfolio",
          ].map((field) => (
            <input
              key={field}
              type={
                field === "password"
                  ? "password"
                  : field === "email"
                  ? "email"
                  : "text"
              }
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              onChange={handleChange}
              required={[
                "name",
                "email",
                "password",
                "age",
                "sex",
                "address",
                "phone",
                "education",
                "experience",
              ].includes(field)}
              className="p-3 rounded-lg bg-[#476C9B] placeholder-white/80 text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
            />
          ))}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-400 text-sm text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 font-semibold py-3 rounded-lg transition-colors duration-200 ${
              loading
                ? "bg-[#476C9B] cursor-not-allowed"
                : "bg-[#984447] hover:bg-[#476C9B]"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // submission logic
    setLoading(false);
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
          ].map((field) =>
            field === "email" || field === "password" ? (
              <input
                key={field}
                type={field === "password" ? "password" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                onChange={handleChange}
                required
                className="p-3 rounded-lg bg-[#476C9B] placeholder-white/80 text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
              />
            ) : (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                onChange={handleChange}
                className="p-3 rounded-lg bg-[#476C9B] placeholder-white/80 text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
              />
            )
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-[#984447] hover:bg-[#476C9B] text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

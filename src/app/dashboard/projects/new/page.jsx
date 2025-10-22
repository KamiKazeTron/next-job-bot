"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewProjectPage() {
  const { status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/user/project", {
        ...formData,
        technologies: JSON.stringify(
          formData.technologies.split(",").map((t) => t.trim())
        ),
      });
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  if (status === "loading")
    return <p className="text-center mt-10 text-[#101419]">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#ADD9F4] flex justify-center items-start p-6">
      <div className="bg-[#101419] text-white rounded-2xl shadow-lg p-6 w-full max-w-lg mt-10">
        <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="w-full p-2 rounded-lg bg-[#476C9B] text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full p-2 rounded-lg bg-[#476C9B] text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
            required
          />
          <input
            name="technologies"
            value={formData.technologies}
            onChange={handleInputChange}
            placeholder="Technologies (comma-separated)"
            className="w-full p-2 rounded-lg bg-[#476C9B] text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
            required
          />
          <button
            type="submit"
            className="bg-[#984447] hover:bg-[#468C98] px-4 py-2 rounded-lg transition-colors duration-200 w-full"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}

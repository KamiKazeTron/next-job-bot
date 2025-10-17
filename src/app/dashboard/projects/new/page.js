"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    image: "",
  });
  const router = useRouter();

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
      router.push("/dashboard/projects"); // Redirect to list
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div>
      <h1>Create New Project</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        />
        <input
          name="technologies"
          value={formData.technologies}
          onChange={handleInputChange}
          placeholder="Technologies (comma-separated)"
          required
        />
        <input
          name="githubUrl"
          value={formData.githubUrl}
          onChange={handleInputChange}
          placeholder="GitHub URL"
        />
        <input
          name="liveUrl"
          value={formData.liveUrl}
          onChange={handleInputChange}
          placeholder="Live URL"
        />
        <input
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          placeholder="Image URL"
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

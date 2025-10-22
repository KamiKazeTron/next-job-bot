"use client";

import { useState } from "react";
import axios from "../../lib/axios";

export default function ProjectUploadForm({ userId }) {
  const [project, setProject] = useState({
    title: "",
    description: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/project", {
        ...project,
        userId,
        technologies: project.technologies.split(",").map((t) => t.trim()), // convert comma-separated string to array
      });

      alert("Project uploaded successfully!");
      setProject({
        title: "",
        description: "",
        technologies: "",
        githubUrl: "",
        liveUrl: "",
        image: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to upload project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: "8px", maxWidth: "500px" }}
    >
      <input
        name="title"
        placeholder="Project Title"
        value={project.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Project Description"
        value={project.description}
        onChange={handleChange}
        required
      />
      <input
        name="technologies"
        placeholder="Technologies (comma separated)"
        value={project.technologies}
        onChange={handleChange}
      />
      <input
        name="githubUrl"
        placeholder="GitHub URL"
        value={project.githubUrl}
        onChange={handleChange}
      />
      <input
        name="liveUrl"
        placeholder="Live URL"
        value={project.liveUrl}
        onChange={handleChange}
      />
      <input
        name="image"
        placeholder="Image URL"
        value={project.image}
        onChange={handleChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload Project"}
      </button>
    </form>
  );
}

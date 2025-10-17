"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null); // Track which project is being edited
  const [formData, setFormData] = useState({}); // Edit form data

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/user/project");
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  const handleEditToggle = (project) => {
    if (editId === project.id) {
      setEditId(null);
    } else {
      setEditId(project.id);
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies.join(", "), // Convert array to comma-separated
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        image: project.image || "",
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put("/api/user/project", {
        id,
        ...formData,
        technologies: JSON.stringify(
          formData.technologies.split(",").map((t) => t.trim())
        ), // Convert to JSON array
      });
      setEditId(null);
      fetchProjects(); // Refresh list
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        await axios.delete(`/api/user/project?id=${id}`);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>My Projects</h1>
      <Link href="/dashboard/projects/new">Add New Project</Link>
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <p>Technologies: {project.technologies.join(", ")}</p>
            {project.githubUrl && (
              <p>
                GitHub: <a href={project.githubUrl}>{project.githubUrl}</a>
              </p>
            )}
            {project.liveUrl && (
              <p>
                Live: <a href={project.liveUrl}>{project.liveUrl}</a>
              </p>
            )}
            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                style={{ maxWidth: "200px" }}
              />
            )}
            <button onClick={() => handleEditToggle(project)}>Edit</button>
            <button onClick={() => handleDelete(project.id)}>Delete</button>

            {editId === project.id && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(project.id);
                }}
              >
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
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

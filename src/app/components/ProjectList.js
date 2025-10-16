"use client";
import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import ProjectUploadForm from "./ProjectUploadForm";

export default function ProjectList({ userId }) {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null); // project being edited

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`/api/project/user?userId=${userId}`);
      setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`/api/project/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Your Projects</h2>
      <ProjectUploadForm userId={userId} onUpload={fetchProjects} />

      <div style={{ marginTop: "24px" }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              border: "1px solid #ccc",
              padding: "8px",
              marginBottom: "8px",
            }}
          >
            {editing === project.id ? (
              <ProjectUploadForm
                userId={userId}
                project={project}
                onUpload={() => {
                  fetchProjects();
                  setEditing(null);
                }}
              />
            ) : (
              <>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p>
                  <strong>Technologies:</strong>{" "}
                  {project.technologies?.join(", ")}
                </p>
                <p>
                  <a href={project.githubUrl} target="_blank">
                    GitHub
                  </a>{" "}
                  |{" "}
                  <a href={project.liveUrl} target="_blank">
                    Live
                  </a>
                </p>
                <button onClick={() => setEditing(project.id)}>Edit</button>
                <button
                  onClick={() => handleDelete(project.id)}
                  style={{ marginLeft: "8px" }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

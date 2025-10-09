"use client";
import { useState, useEffect } from "react";
import axios from "../lib/axios";

export default function ProjectUploadForm() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", image: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/user/projects");
        if (res.data.projects) setProjects(res.data.projects);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onAdd(e) {
    e.preventDefault();
    try {
      const res = await axios.post("/user/projects", form);
      setProjects((prev) => [res.data.project, ...prev]);
      setForm({ title: "", description: "", image: "" });
    } catch (err) {
      console.error(err);
      alert("Error adding project");
    }
  }

  return (
    <div>
      <form onSubmit={onAdd} style={{ display: "grid", gap: 8 }}>
        <input
          name="title"
          value={form.title}
          onChange={onChange}
          placeholder="Project title"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Description"
          required
        />
        <input
          name="image"
          value={form.image}
          onChange={onChange}
          placeholder="Image URL"
        />
        <button type="submit">Add Project</button>
      </form>

      <div style={{ marginTop: 16 }}>
        <h4>Existing Projects</h4>
        {projects.map((p) => (
          <div
            key={p.id}
            style={{ border: "1px solid #eee", padding: 8, marginBottom: 8 }}
          >
            <strong>{p.title}</strong>
            <p>{p.description}</p>
            {p.image && (
              <img src={p.image} alt={p.title} style={{ maxWidth: 200 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import axios from "axios";

export default function ChatBot({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", {
        userId,
        message: input,
      });

      const aiMessage = { role: "ai", content: res.data.response };
      setMessages((prev) => [...prev, aiMessage]);
      setInput("");
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error: Could not get response from AI" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
      }}
    >
      <div style={{ height: "400px", overflowY: "auto", marginBottom: "16px" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "8px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "16px",
                background: msg.role === "user" ? "#3b82f6" : "#e5e7eb",
                color: msg.role === "user" ? "#fff" : "#000",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "8px 16px" }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

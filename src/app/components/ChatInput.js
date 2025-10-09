"use client";
import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await onSend(text.trim());
    setText("");
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, marginTop: 12 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe the job posting or paste requirements..."
        style={{ flex: 1 }}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>
        Send
      </button>
    </form>
  );
}

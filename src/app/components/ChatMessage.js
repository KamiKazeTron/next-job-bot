export default function ChatMessage({ sender, message }) {
  const align = sender === "user" ? "flex-end" : "flex-start";
  const bg = sender === "user" ? "#DCF8C6" : "#F1F0F0";
  return (
    <div style={{ display: "flex", justifyContent: align, margin: "6px 0" }}>
      <div
        style={{
          background: bg,
          padding: "8px 12px",
          borderRadius: 8,
          maxWidth: "70%",
        }}
      >
        <div style={{ fontSize: 14 }}>{message}</div>
      </div>
    </div>
  );
}

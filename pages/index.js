import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      setChat([...newChat, {
        role: "assistant",
        content: data.reply || "Error"
      }]);

    } catch (err) {
      setChat([...newChat, {
        role: "assistant",
        content: "Server error"
      }]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Saxia AI</h1>

        <div style={styles.chatBox}>
          {chat.map((c, i) => (
            <div
              key={i}
              style={c.role === "user" ? styles.userMsg : styles.botMsg}
            >
              {c.content}
            </div>
          ))}
          {loading && <div style={styles.botMsg}>Typing...</div>}
        </div>

        <div style={styles.inputArea}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type something..."
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f5f5f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    width: "100%",
    maxWidth: 700,
    background: "#ffffff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  chatBox: {
    height: 400,
    overflowY: "auto",
    border: "1px solid #eee",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15
  },
  userMsg: {
    background: "#0070f3",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: "right"
  },
  botMsg: {
    background: "#eaeaea",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  inputArea: {
    display: "flex",
    gap: 10
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    background: "#0070f3",
    color: "white",
    cursor: "pointer"
  }
};

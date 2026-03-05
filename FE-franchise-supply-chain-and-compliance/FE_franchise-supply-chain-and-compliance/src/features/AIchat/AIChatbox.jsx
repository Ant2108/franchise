import { useState,useRef,useEffect } from "react";
import "./AiboxStyle/AIChatbox.css";
import AIServiceAPI from "./aiServiceAPI/aiService";

export default function AIChatbox() {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat, loading]);

  const sendMessage = async () => {

    if (!message.trim() || loading) return;

    const userText = message;

    const userMessage = { role: "user", text: userText };

    setChat(prev => [...prev, userMessage]);

    setMessage(""); // clear input ngay
    setLoading(true);

    try {

      const res = await AIServiceAPI.sendMessage(userText);

      const aiMessage = {
        role: "ai",
        text: res.reply
      };

      setChat(prev => [...prev, aiMessage]);

    } catch (error) {

      setChat(prev => [
        ...prev,
        { role: "ai", text: "AI error!" }
      ]);

      console.error(error);

    }

    setLoading(false);

  };

  return (
    <>
      <button
        className="chat-button"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {open && (

        <div className="chatbox">

          {/* HEADER */}
          <div className="chat-header">

            <span>AI Supply Assistant</span>

            <button
              className="close-btn"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

          </div>


          <div className="chat-container">

            {/* HISTORY SIDEBAR */}
            <div className="chat-history">

              <div className="history-title">
                History
              </div>

              <button
                className="new-chat"
                onClick={() => setChat([])}
              >
                + New Chat
              </button>

            </div>


            {/* CHAT AREA */}
            <div className="chat-main">

              <div className="chat-body">

                {chat.map((c, i) => (
                  <div
                    key={i}
                    className={c.role === "user" ? "user-msg" : "ai-msg"}
                  >
                    {c.text}
                  </div>

                ))}

                {loading && (
                  <div className="ai-msg typing">
                    AI is thinking...
                  </div>
                )}
                <div ref={chatEndRef}></div>

              </div>


              <div className="chat-input">

                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about warehouse, supplier..."
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />

                <button
                  onClick={sendMessage}
                  disabled={loading}
                >
                  Send
                </button>

              </div>

            </div>

          </div>

        </div>

      )}
    </>
  );
}
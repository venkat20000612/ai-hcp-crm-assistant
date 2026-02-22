import { useState, useRef, useEffect } from "react";

export default function ChatInteraction({ formRef }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const chatEndRef = useRef(null);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);


  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;

    setMessages((prev) => [...prev, { text: userMsg, type: "user" }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/log-interaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg }),
        }
      );

      const data = await response.json();

      formRef.current.fillForm(data);

      setMessages((prev) => [
        ...prev,
        {
          text:
            data.summary ||
            "I've updated the interaction details.",
          type: "ai",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Error occurred.", type: "ai" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };


  const isMobile = window.innerWidth <= 1024;

  return (
    <>

      {isMobile && !isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#4f46e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "26px",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
            zIndex: 9999,
          }}
        >
          🤖
        </div>
      )}


      {(isOpen || !isMobile) && (
        <div
          style={{
            position: isMobile ? "fixed" : "relative",
            bottom: isMobile ? "0" : "auto",
            right: isMobile ? "0" : "auto",
            width: isMobile ? "100%" : "100%",
            height: isMobile ? "85vh" : "100%",
            background: "#f3f4f6",
            display: "flex",
            flexDirection: "column",
            borderRadius: isMobile ? "15px 15px 0 0" : "0",
            boxShadow: isMobile
              ? "0 -4px 20px rgba(0,0,0,0.2)"
              : "none",
            zIndex: 9999,
          }}
        >

          <div
            style={{
              padding: "12px",
              background: "#4f46e5",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: isMobile ? "15px 15px 0 0" : "0",
            }}
          >
            <span>AI Assistant</span>

            {isMobile && (
              <span
                onClick={() => setIsOpen(false)}
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                ✕
              </span>
            )}
          </div>


          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "15px",
              background: "white",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign:
                    msg.type === "user" ? "right" : "left",
                  margin: "10px 0",
                }}
              >
                <span
                  style={{
                    background:
                      msg.type === "user"
                        ? "#4f46e5"
                        : "#e5e7eb",
                    color:
                      msg.type === "user"
                        ? "white"
                        : "#111827",
                    padding: "10px 14px",
                    borderRadius: "14px",
                    display: "inline-block",
                    maxWidth: "75%",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {isTyping && (
              <span
                style={{
                  background: "#e5e7eb",
                  padding: "10px 14px",
                  borderRadius: "14px",
                }}
              >
                typing...
              </span>
            )}

            <div ref={chatEndRef}></div>
          </div>


          <div style={{ display: "flex", padding: "10px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type message..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                marginLeft: "10px",
                background: "#4f46e5",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
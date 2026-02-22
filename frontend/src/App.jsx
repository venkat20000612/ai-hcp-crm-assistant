import { useRef, useState, useEffect } from "react";
import LogInteraction from "./LogInteraction";
import ChatInteraction from "./ChatInteraction";

function App() {
  const formRef = useRef();

  // ✅ detect mobile/tablet
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 1024
  );

  // ✅ update on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        display: isMobile ? "block" : "flex",
        height: "100vh",
        fontFamily: "Inter",
      }}
    >
      {/* ================= FORM ================= */}
      <div
        style={{
          flex: 3,
          padding: "20px",
          borderRight: isMobile ? "none" : "1px solid #ddd",
          overflowY: "auto",
          height: "100%",
        }}
      >
        <LogInteraction ref={formRef} />
      </div>

      {/* ================= CHAT ================= */}
      {!isMobile && (
        <div
          style={{
            flex: 1,
            padding: "20px",
            background: "#f5f6f8",
          }}
        >
          <ChatInteraction formRef={formRef} />
        </div>
      )}

      {/* ✅ MOBILE FLOATING CHAT */}
      {isMobile && <ChatInteraction formRef={formRef} />}
    </div>
  );
}

export default App;
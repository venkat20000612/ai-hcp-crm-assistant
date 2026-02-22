import { useEffect, useState } from "react";

export default function InteractionHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/interactions")
      .then((res) => res.json())
      .then((result) => setData(result));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Interaction History</h2>

      {data.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <strong>User Message:</strong>
          <p>{item.message}</p>

          <strong>AI Summary:</strong>
          <p>{item.summary}</p>
        </div>
      ))}
    </div>
  );
}
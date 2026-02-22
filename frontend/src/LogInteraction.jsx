import { useState, forwardRef, useImperativeHandle } from "react";
import { Search, Package } from "lucide-react";

const LogInteraction = forwardRef((props, ref) => {
    const [form, setForm] = useState({
        hcp_name: "",
        interaction_type: "Meeting",
        date: "",
        time: "",
        attendees: "",
        topics: "",
        sentiment: "Neutral",
        outcomes: "",
        followup: "",
    });


    useImperativeHandle(ref, () => ({
        fillForm: (data) => {
            setForm((prev) => ({ ...prev, ...data }));
        },
    }));

   
    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const input = {
        width: "100%",
        padding: "10px 12px",
        height: "42px",  
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        marginTop: "6px",
        boxSizing: "border-box",
    };

    const card = {
        background: "#fff",
        padding: "18px",
        borderRadius: "8px",
        marginBottom: "20px",
        border: "1px solid #e5e7eb",
    };

    return (
        <div>
            <h2 style={{ marginBottom: 20 }}>Log HCP Interaction</h2>

        
            <div style={card}>
                <h4>Interaction Details</h4>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        columnGap: "25px",
                        rowGap: "18px",
                        marginTop: "10px",
                    }}
                >
                    <div>
                        <label>HCP Name</label>
                        <input
                            style={input}
                            value={form.hcp_name}
                            onChange={(e) =>
                                handleChange("hcp_name", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label>Interaction Type</label>
                        <select
                            style={input}
                            value={form.interaction_type}
                            onChange={(e) =>
                                handleChange("interaction_type", e.target.value)
                            }
                        >
                            <option>Meeting</option>
                            <option>Call</option>
                            <option>Email</option>
                        </select>
                    </div>

                    <div>
                        <label>Date</label>
                        <input
                            type="date"
                            style={input}
                            value={form.date}
                            onChange={(e) =>
                                handleChange("date", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label>Time</label>
                        <input
                            type="time"
                            style={input}
                            value={form.time}
                            onChange={(e) =>
                                handleChange("time", e.target.value)
                            }
                        />
                    </div>
                </div>

                <div style={{ marginTop: "15px" }}>
                    <label>Attendees</label>
                    <input
                        style={input}
                        value={form.attendees}
                        onChange={(e) =>
                            handleChange("attendees", e.target.value)
                        }
                    />
                </div>

                <div style={{ marginTop: "15px" }}>
                    <label>Topics Discussed</label>
                    <textarea
                        style={input}
                        rows={3}
                        value={form.topics}
                        onChange={(e) =>
                            handleChange("topics", e.target.value)
                        }
                    />
                </div>
            </div>

        
            <div style={card}>
                <h4>Materials Shared / Samples Distributed</h4>

            
                <div style={{ marginTop: "15px" }}>
                    <label>Materials Shared</label>

                    <div style={{ position: "relative", marginTop: "6px" }}>
                        <input
                            style={{ ...input, paddingRight: "120px" }}
                            placeholder="Search materials..."
                        />

                    
                        <Search
                            size={18}
                            style={{
                                position: "absolute",
                                right: "80px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#6b7280",
                            }}
                        />

                  
                        <button
                            style={{
                                position: "absolute",
                                right: "6px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "#eef2ff",
                                color: "#4f46e5",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: 500,
                            }}
                        >
                            + Add
                        </button>
                    </div>

                   
                    <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>
                        No materials added yet.
                    </p>
                </div>

 
                <div style={{ marginTop: "18px" }}>
                    <label>Samples Distributed</label>

                    <div style={{ position: "relative", marginTop: "6px" }}>
                        <input
                            style={{ ...input, paddingRight: "170px" }}
                            placeholder="Add sample..."
                        />

                      
                        <Package
                            size={18}
                            style={{
                                position: "absolute",
                                right: "100px",
                                top: "50%",
                                transform: "translateY(-48%)",
                                color: "#6b7280",
                            }}
                        />

                        <button
                            style={{
                                position: "absolute",
                                right: "6px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "#eef2ff",
                                color: "#4f46e5",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: 500,
                            }}
                        >
                            Add Sample
                        </button>
                    </div>

                    <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>
                        No samples added yet.
                    </p>
                </div>
            </div>


            <div style={card}>
                <h4>Observed / Inferred HCP Sentiment</h4>

                {["Positive", "Neutral", "Negative"].map((s) => (
                    <label key={s} style={{ marginRight: 20 }}>
                        <input
                            type="radio"
                            checked={form.sentiment === s}
                            onChange={() => handleChange("sentiment", s)}
                        />{" "}
                        {s}
                    </label>
                ))}
            </div>

        
            <div style={card}>
                <h4>Outcomes</h4>
                <textarea
                    style={input}
                    rows={3}
                    value={form.outcomes}
                    onChange={(e) =>
                        handleChange("outcomes", e.target.value)
                    }
                />

                <h4 style={{ marginTop: 15 }}>Follow-up Actions</h4>
                <textarea
                    style={input}
                    rows={3}
                    value={form.followup}
                    onChange={(e) =>
                        handleChange("followup", e.target.value)
                    }
                />
            </div>
        </div>
    );
});

export default LogInteraction;
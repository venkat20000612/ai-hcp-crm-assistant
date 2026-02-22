from langgraph.graph import StateGraph, END
from typing import TypedDict
from agent import summarize_interaction

# State
class AgentState(TypedDict):
    message: str
    result: str


# TOOL 1: Log Interaction
def log_interaction_tool(state: AgentState):
    state["result"] = f"Interaction logged: {state['message']}"
    return state


# TOOL 2: Edit Interaction
def edit_interaction_tool(state: AgentState):
    edited = state["message"] + " (Edited)"
    state["result"] = edited
    return state


# TOOL 3: Summarize
def summarize_tool(state: AgentState):
    summary = summarize_interaction(state["message"])
    state["result"] = summary
    return state


# TOOL 4: Follow-up Suggestion
def followup_tool(state: AgentState):
    state["result"] = "Suggested follow-up: Schedule meeting next week."
    return state


# TOOL 5: Sentiment Analysis
def sentiment_tool(state: AgentState):
    state["result"] = "Sentiment detected: Positive interaction."
    return state


# Graph Flow
builder = StateGraph(AgentState)

builder.add_node("log", log_interaction_tool)
builder.add_node("edit", edit_interaction_tool)
builder.add_node("summarize", summarize_tool)
builder.add_node("followup", followup_tool)
builder.add_node("sentiment", sentiment_tool)

builder.set_entry_point("summarize")
builder.add_edge("summarize", END)

graph = builder.compile()


def run_agent(message: str):
    result = graph.invoke({"message": message, "result": ""})
    return result["result"]
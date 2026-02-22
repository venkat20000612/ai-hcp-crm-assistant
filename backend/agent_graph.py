from langgraph.graph import StateGraph, END
from typing import TypedDict
from agent import summarize_interaction
from tools import (
    log_interaction_tool,
    edit_interaction_tool,
    sentiment_tool,
    followup_tool,
    summary_tool
)


class AgentState(TypedDict):
    message: str
    result: dict



def process_interaction(state: AgentState):

    message = state["message"]

    result = summarize_interaction(message)

    return {
        "message": message,
        "result": result
    }



builder = StateGraph(AgentState)

builder.add_node("interaction_node", process_interaction)

builder.set_entry_point("interaction_node")

builder.add_edge("interaction_node", END)

graph = builder.compile()
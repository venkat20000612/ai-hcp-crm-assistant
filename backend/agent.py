import os
import json
import re
from datetime import datetime, date, timedelta
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()


llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

conversation_memory = ""


current_form = {
    "hcp_name": "",
    "interaction_type": "Meeting",
    "date": "",
    "time": "",
    "topics": "",
    "sentiment": "",
    "outcomes": "",
    "followup": "",
}





def normalize_time(time_str):
    if not time_str:
        return ""

    try:
        return datetime.strptime(time_str.upper(), "%I:%M %p").strftime("%H:%M")
    except:
        try:
            return datetime.strptime(time_str.upper(), "%I %p").strftime("%H:%M")
        except:
            return time_str



def normalize_date(date_str):
    if not date_str:
        return ""

    d = date_str.strip().lower()
    today = date.today()

    if d == "today":
        return today.strftime("%Y-%m-%d")

    if d == "yesterday":
        return (today - timedelta(days=1)).strftime("%Y-%m-%d")

    if d == "tomorrow":
        return (today + timedelta(days=1)).strftime("%Y-%m-%d")

    formats = [
        "%Y-%m-%d",
        "%d-%m-%Y",
        "%d/%m/%Y",
        "%m/%d/%Y",
        "%d %b %Y",
        "%d %B %Y",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except:
            continue

    return date_str


# MAIN FUNCTION
def summarize_interaction(message: str):
    global conversation_memory, current_form

    conversation_memory += f"\nUser: {message}"

    prompt = f"""
You are a conversational AI CRM assistant.

You both:
1) Maintain structured CRM form data.
2) Talk naturally with the user like ChatGPT.

Current Form Data:
{current_form}

Conversation History:
{conversation_memory}

TASK:
- Understand user's message.
- Update only changed fields.
- Respond conversationally acknowledging what changed.

FIELD DEFINITIONS:
- hcp_name → Doctor name.
- date → Interaction date.
- time → Interaction time.
- topics → Discussion topics.
- sentiment → Positive, Neutral, Negative.
- outcomes → Meeting results.
- followup → Next steps.

RULES:
- Be polite and natural.
- If user corrects something, acknowledge it.
- If user says sorry, respond kindly.
- Explain briefly what was updated.
- Always keep conversation human-like.

Return ONLY JSON:

{{
 "hcp_name": "",
 "interaction_type": "Meeting",
 "date": "",
 "time": "",
 "topics": "",
 "sentiment": "",
 "outcomes": "",
 "followup": "",
 "summary": "Natural conversational reply to the user"
}}
"""

    # CALL LLM 
    response = llm.invoke(prompt)
    raw_output = response.content.strip()

    # JSON EXTRACTION 
    match = re.search(r"\{.*\}", raw_output, re.DOTALL)

    if not match:
        print("Invalid response:", raw_output)
        return current_form

    json_text = match.group(0)

    try:
        parsed = json.loads(json_text)
    except Exception as e:
        print("JSON parse error:", e)
        print(json_text)
        return current_form

    # SMART UPDATE 
    for key, value in parsed.items():
        if key in current_form and value:

            if key == "time":
                value = normalize_time(value)

            if key == "date":
                value = normalize_date(value)

            current_form[key] = value

    # IMPORTANT — include AI reply
    response_payload = {
        **current_form,
        "summary": parsed.get(
            "summary",
            "I've updated the interaction details."
        ),
    }

    return response_payload
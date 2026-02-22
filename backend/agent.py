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

# NORMALIZERS

def normalize_sentiment(value):
    if not value:
        return ""

    v = value.lower()

    if "positive" in v:
        return "Positive"
    if "negative" in v:
        return "Negative"
    if "neutral" in v:
        return "Neutral"

    return value


def normalize_time(time_str):
    if not time_str:
        return ""

    t = time_str.strip().upper().replace(".", "")

    formats = [
        "%I:%M %p",
        "%I %p",
        "%H:%M"
    ]

    for fmt in formats:
        try:
            return datetime.strptime(t, fmt).strftime("%H:%M")
        except:
            continue

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

Current Form Data:
{current_form}

Conversation History:
{conversation_memory}

Understand the latest message and update only changed fields.

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
 "summary": "Natural conversational reply"
}}
"""

    response = llm.invoke(prompt)
    raw_output = response.content.strip()

    match = re.search(r"\{.*\}", raw_output, re.DOTALL)

    if not match:
        print("Invalid AI response:", raw_output)
        return {**current_form, "summary": "Sorry, I couldn't understand that."}

    json_text = match.group(0)

    try:
        parsed = json.loads(json_text)
    except Exception as e:
        print("JSON parse error:", e)
        return {**current_form, "summary": "AI response parsing failed."}

    # ONLY FIELD FIXES ADDED 
    for key, value in parsed.items():
        if key in current_form and value:

            if key == "time":
                value = normalize_time(value)

            elif key == "date":
                value = normalize_date(value)

            elif key == "sentiment":
                value = normalize_sentiment(value)

            current_form[key] = value

    # KEEP REALTIME AI REPLY
    response_payload = {
        **current_form,
        "summary": parsed.get("summary", "Updated successfully.")
    }

    return response_payload
# AI HCP CRM Assistant

An AI-powered Healthcare CRM system that converts natural conversations into structured HCP interaction records using an intelligent AI agent.

This project demonstrates how **AI agents + conversational interfaces** can automate CRM data entry for pharmaceutical and healthcare workflows.

---------------------------

## Project Overview

Medical representatives frequently log doctor interactions manually.  
This project introduces an **AI-first CRM experience** where users simply chat with an AI assistant and the system automatically fills structured interaction forms.

Users can:

=> Describe meetings in natural language  
=> Automatically populate CRM forms  
=> Correct fields via conversation  
=> Maintain interaction memory  
=> Receive conversational AI responses

---------------------------

## System Architecture

User (Chat UI)
↓
React Frontend (Vite)
↓
FastAPI Backend
↓
LangGraph AI Agent
↓
Groq LLM (Llama 3.3 70B)
↓
Structured CRM Data
↓
Auto Form Update

-------------------------------

## Repository Structure

ai-hcp-crm-assistant/
│
├── frontend/ # React + Vite UI
│
├── backend/ # FastAPI AI backend
│
├── README.md # Project documentation
└── .gitignore

---------------------------------

## Frontend (React + Vite UI)


### Features

- Log HCP Interaction Form
- AI Chat Assistant
- Auto form filling
- Conversational updates
- Mobile floating AI chat button
- Responsive layout

### Tech Stack

- React (Vite)
- JavaScript
- CSS / Inline Styling
- Fetch API

### Run Locally

# bash
cd frontend
npm install
npm run dev


------------------------------------------

## Backend (FastAPI + AI Agent)

Location:
/backend


### Features

- AI interaction parsing
- Conversational memory
- Date & time normalization
- Structured CRM extraction
- REST APIs

### Tech Stack

- FastAPI
- Python
- LangGraph
- Groq LLM
- SQLAlchemy
- SQLite

### Run Locally

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload


-----------------------------------------

###  AI Agent Capabilities

The AI assistant:

  - Extracts structured fields from conversations
  - Updates only corrected values
  - Maintains session memory
  - Responds conversationally
  - Understands corrections naturally

# Example

 User:
    - Met Dr Reddy today at 3 PM. Positive meeting.

AI:
   Auto fills interaction form.

User:
   - Actually sentiment was negative.

AI:
  Updates only sentiment field.


----------------------------------------------

### API Endpoints

Health Check
    - GET /
  Log Interaction
    - POST /log-interaction

## Request:

{
  "message": "Met Dr Reddy today discussed insulin therapy"
}



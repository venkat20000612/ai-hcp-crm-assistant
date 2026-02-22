from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import summarize_interaction

from database import engine, SessionLocal, Base
from models import Interaction as InteractionModel
from sqlalchemy.orm import Session

app = FastAPI()

# DATABASE
Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REQUEST MODEL
class Interaction(BaseModel):
    message: str


# HEALTH CHECK
@app.get("/")
def home():
    return {"message": "AI CRM Backend Running ✅"}


# AI CHAT ENDPOINT
@app.post("/log-interaction")
def log_interaction(data: Interaction):

    # call AI agent
    ai_result = summarize_interaction(data.message)

    # already dict  directly return
    return ai_result


# FETCH INTERACTIONS
@app.get("/interactions")
def get_interactions():

    db: Session = SessionLocal()

    try:
        data = db.query(InteractionModel).all()
        return data
    finally:
        db.close()
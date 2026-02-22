from sqlalchemy import Column, Integer, String
from database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    summary = Column(String)
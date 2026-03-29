from sqlalchemy import Column, String, JSON
import uuid

from app.db.base import Base

class Design(Base):
    __tablename__ = "designs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String)
    components = Column(JSON)
    connections = Column(JSON)
    explanations = Column(JSON)
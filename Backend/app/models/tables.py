from sqlalchemy import Column, Integer, String, DateTime, func
from app.models.database import Base

class Document(Base):
    """SQLAlchemy model for storing document metadata."""
    
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    file_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Document(id={self.id}, file_name='{self.file_name}')>" 
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class QueryRequest(BaseModel):
    """Schema for query request."""
    query: str = Field(..., description="The question to ask about the documents")
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "What is the main topic of the document?"
            }
        }

class QueryResponse(BaseModel):
    """Schema for query response."""
    answer: str = Field(..., description="The answer to the query based on document context")
    
    class Config:
        json_schema_extra = {
            "example": {
                "answer": "The main topic of the document is..."
            }
        }

class UploadResponse(BaseModel):
    """Schema for upload response."""
    document_id: int = Field(..., description="The ID of the uploaded document")
    file_name: str = Field(..., description="The name of the uploaded file")
    
    class Config:
        json_schema_extra = {
            "example": {
                "document_id": 1,
                "file_name": "example.pdf"
            }
        }

class ErrorResponse(BaseModel):
    """Schema for error responses."""
    detail: str = Field(..., description="Error message")
    
    class Config:
        json_schema_extra = {
            "example": {
                "detail": "An error occurred while processing the request"
            }
        }
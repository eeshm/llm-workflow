from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any
import logging
from app.models.database import get_db
from app.models.schemas import QueryRequest, QueryResponse, UploadResponse, ErrorResponse
from app.services.document_service import process_document
from app.services.query_service import answer_query

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1", tags=["RAG Service"])

@router.post(
    "/upload",
    response_model=UploadResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse, "description": "Bad Request"},
        500: {"model": ErrorResponse, "description": "Internal Server Error"}
    },
    summary="Upload PDF Document",
    description="Upload a PDF document for processing and ingestion into the RAG system."
)
async def upload_document(
    file: UploadFile = File(..., description="PDF file to upload"),
    db: Session = Depends(get_db)
) -> UploadResponse:
    """
    Upload and process a PDF document.
    
    This endpoint:
    1. Accepts a PDF file
    2. Extracts text from the PDF
    3. Chunks the text
    4. Generates embeddings
    5. Stores embeddings in ChromaDB
    6. Stores metadata in PostgreSQL
    
    Args:
        file: The uploaded PDF file
        db: Database session (injected)
        
    Returns:
        UploadResponse with document ID and filename
        
    Raises:
        HTTPException: If file is not PDF or processing fails
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF files are supported"
            )
        
        # Validate file size (optional - add if needed)
        # file_size = len(await file.read())
        # await file.seek(0)  # Reset file pointer
        # if file_size > 10 * 1024 * 1024:  # 10MB limit
        #     raise HTTPException(
        #         status_code=status.HTTP_400_BAD_REQUEST,
        #         detail="File size must be less than 10MB"
        #     )
        
        logger.info(f"Processing uploaded file: {file.filename}")
        
        # Process the document
        document_id = process_document(
            file=file,
            file_name=file.filename,
            db_session=db
        )
        
        return UploadResponse(
            document_id=document_id,
            file_name=file.filename
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading document: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process document: {str(e)}"
        )

@router.post(
    "/query",
    response_model=QueryResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse, "description": "Bad Request"},
        500: {"model": ErrorResponse, "description": "Internal Server Error"}
    },
    summary="Query Documents",
    description="Ask a question about the uploaded documents and get an AI-generated answer."
)
async def query_documents(
    request: QueryRequest
) -> QueryResponse:
    """
    Query the uploaded documents using RAG.
    
    This endpoint:
    1. Takes a user question
    2. Generates embedding for the question
    3. Retrieves relevant context from ChromaDB
    4. Constructs a prompt with context
    5. Generates an answer using GPT-4o-mini
    
    Args:
        request: QueryRequest containing the user's question
        
    Returns:
        QueryResponse with the generated answer
        
    Raises:
        HTTPException: If query processing fails
    """
    try:
        # Validate query
        if not request.query.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Query cannot be empty"
            )
        
        logger.info(f"Processing query: {request.query}")
        
        # Get answer using RAG pipeline
        answer = answer_query(request.query)
        
        return QueryResponse(answer=answer)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process query: {str(e)}"
        )

@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Health Check",
    description="Check if the service is running and healthy."
)
async def health_check() -> dict[str, str]:
    """
    Health check endpoint.
    
    Returns:
        Status message
    """
    return {"status": "healthy", "service": "RAG Backend Service"}
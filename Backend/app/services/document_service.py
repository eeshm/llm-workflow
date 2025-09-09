import fitz  # PyMuPDF
import openai
import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sqlalchemy.orm import Session
from fastapi import UploadFile
from typing import List, Dict, Any
import logging
from app.core.config import settings
from app.models.tables import Document

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
openai_client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

# ChromaDB collection name
COLLECTION_NAME = "document_collection"

def get_chroma_client():
    """Get or create ChromaDB persistent client."""
    return chromadb.PersistentClient(
        path=settings.CHROMA_DB_PATH,
        settings=ChromaSettings(anonymized_telemetry=False)
    )

def extract_text_from_pdf(file_content: bytes) -> str:
    """
    Extract text from PDF file content using PyMuPDF.
    
    Args:
        file_content: PDF file content as bytes
        
    Returns:
        Extracted text from all pages
    """
    try:
        # Open PDF from bytes
        pdf_document = fitz.open(stream=file_content, filetype="pdf")
        
        # Extract text from all pages
        full_text = ""
        for page_num in range(pdf_document.page_count):
            page = pdf_document[page_num]
            full_text += page.get_text()
        
        pdf_document.close()
        
        return full_text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        raise

def chunk_text(text: str) -> List[str]:
    """
    Split text into chunks using RecursiveCharacterTextSplitter.
    
    Args:
        text: Full text to split
        
    Returns:
        List of text chunks
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    
    chunks = text_splitter.split_text(text)
    return chunks

def generate_embedding(text: str) -> List[float]:
    """
    Generate embedding for text using OpenAI's text-embedding-3-small model.
    
    Args:
        text: Text to embed
        
    Returns:
        Embedding vector
    """
    try:
        response = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error generating embedding: {str(e)}")
        raise




def process_document(file: UploadFile, file_name: str, db_session: Session) -> int:
    """
    Process uploaded PDF document through the entire ingestion pipeline.
    
    Args:
        file: Uploaded PDF file
        file_name: Name of the file
        db_session: Database session
        
    Returns:
        Document ID from database
    """
    try:
        # Read file content
        file_content = file.file.read()
        
        # Step 1: Extract text from PDF
        logger.info(f"Extracting text from {file_name}")
        full_text = extract_text_from_pdf(file_content)
        
        if not full_text:
            raise ValueError("No text could be extracted from the PDF")
        
        # Step 2: Chunk the text
        logger.info(f"Chunking text for {file_name}")
        chunks = chunk_text(full_text)
        logger.info(f"Created {len(chunks)} chunks")
        
        # Step 3: Generate embeddings and store in ChromaDB
        logger.info(f"Generating embeddings for {file_name}")
        
        # Get ChromaDB client and collection
        chroma_client = get_chroma_client()
        
        # Get or create collection
        try:
            collection = chroma_client.get_collection(name=COLLECTION_NAME)
        except:
            collection = chroma_client.create_collection(name=COLLECTION_NAME)
        
        # Prepare data for ChromaDB
        embeddings = []
        documents = []
        metadatas = []
        ids = []
        
        for index, chunk in enumerate(chunks):
            # Generate embedding
            embedding = generate_embedding(chunk)
            
            # Prepare data
            embeddings.append(embedding)
            documents.append(chunk)
            metadatas.append({
                "file_name": file_name,
                "chunk_num": index
            })
            ids.append(f"{file_name}_{index}")
        
        # Store in ChromaDB
        collection.add(
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        logger.info(f"Stored {len(chunks)} chunks in ChromaDB")
        
        # Step 4: Store metadata in PostgreSQL
        logger.info(f"Storing metadata in PostgreSQL for {file_name}")
        
        document = Document(file_name=file_name)
        db_session.add(document)
        db_session.commit()
        db_session.refresh(document)
        
        logger.info(f"Document processed successfully with ID: {document.id}")
        
        return document.id
        
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}")
        db_session.rollback()
        raise
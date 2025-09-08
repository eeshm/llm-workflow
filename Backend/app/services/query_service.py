import openai
import chromadb
from chromadb.config import Settings as ChromaSettings
from typing import List, Dict, Any
import logging
from app.core.config import settings

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

def generate_query_embedding(query: str) -> List[float]:
    """
    Generate embedding for query using OpenAI's text-embedding-3-small model.
    
    Args:
        query: Query text to embed
        
    Returns:
        Embedding vector
    """
    try:
        response = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=query
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error generating query embedding: {str(e)}")
        raise

def retrieve_context(query_embedding: List[float], n_results: int = 3) -> str:
    """
    Retrieve relevant context from ChromaDB based on query embedding.
    
    Args:
        query_embedding: Query embedding vector
        n_results: Number of results to retrieve
        
    Returns:
        Combined context from retrieved chunks
    """
    try:
        # Get ChromaDB client and collection
        chroma_client = get_chroma_client()
        
        try:
            collection = chroma_client.get_collection(name=COLLECTION_NAME)
        except:
            # If collection doesn't exist, return empty context
            logger.warning("Collection not found. No documents have been uploaded yet.")
            return ""
        
        # Perform similarity search
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        # Extract and combine documents
        if results and results['documents'] and results['documents'][0]:
            context_chunks = results['documents'][0]
            combined_context = "\n---\n".join(context_chunks)
            return combined_context
        
        return ""
        
    except Exception as e:
        logger.error(f"Error retrieving context: {str(e)}")
        raise

def construct_prompt(context: str, query: str) -> str:
    """
    Construct prompt for LLM using the specified template.
    
    Args:
        context: Retrieved context
        query: User query
        
    Returns:
        Formatted prompt
    """
    prompt = f"""Use the following context to answer the question. If the answer is not found in the context, state that you don't know.

Context:
---
{context}
---
Question: {query}"""
    
    return prompt

def generate_response(prompt: str) -> str:
    """
    Generate response using OpenAI's GPT-4o-mini model.
    
    Args:
        prompt: Constructed prompt
        
    Returns:
        Generated response
    """
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that answers questions based on the provided context."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        raise

def answer_query(query: str) -> str:
    """
    Main function to answer user query using RAG pipeline.
    
    Args:
        query: User question
        
    Returns:
        Generated answer
    """
    try:
        # Step 1: Generate query embedding
        logger.info(f"Processing query: {query}")
        query_embedding = generate_query_embedding(query)
        
        # Step 2: Retrieve context
        logger.info("Retrieving relevant context")
        context = retrieve_context(query_embedding, n_results=3)
        
        if not context:
            return "I don't have any documents to answer your question. Please upload a PDF document first."
        
        # Step 3: Construct prompt
        prompt = construct_prompt(context, query)
        
        # Step 4: Generate response
        logger.info("Generating response")
        response = generate_response(prompt)
        
        return response
        
    except Exception as e:
        logger.error(f"Error answering query: {str(e)}")
        raise
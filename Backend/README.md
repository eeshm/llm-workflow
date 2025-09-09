# Backend Service: AI Workflow Engine ⚙️

This directory contains the FastAPI backend for the No-Code AI Workflow Builder. It handles document processing, AI model interactions, and the orchestration of user-defined workflows.

---

## API & Core Logic

-   **Document Processing:** An `/upload` endpoint handles PDF parsing, text chunking, embedding generation, and storage in ChromaDB.
-   **AI Services:** Integrates with OpenAI/Gemini for text generation and embedding.
-   **Chat Query:** An `/query` enpoint handles the user question and create embeddings from that question and retrive relevant context from ChromaDB and construct prompt with that context and generates answer using gpt-4o-mini.

---

## Local Development Setup

### Prerequisites

-   Python (v3.10+)
-   Pip & a virtual environment tool (`venv`)
-   Access to a running PostgreSQL and ChromaDB instance.

### Setup Instructions

1.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure Environment Variables:**
    -   Create a `.env` file from the example:
    ```bash
    cp .env.example .env
    ```
    -   Update the `.env` file with your credentials:
        -   `DATABASE_URL`: Your PostgreSQL connection string.
        -   `OPENAI_API_KEY`: Your key for OpenAI services.
        -   `CHROMA_DB_PATH`: Local path for ChromaDB persistence.

4.  **Run the Server:**
    ```bash
    uvicorn main:app --reload --port 8000
    ```
    The API documentation will be available at `http://localhost:8000/docs`.

5. **Backend routes:**
```bash
curl -X POST "http://localhost:8000/api/v1/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

### Query Document (using curl):
```bash
curl -X POST "http://localhost:8000/api/v1/query" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the main topic of the document?"}'

```
---

## Project Structure

/
|-- api/          # FastAPI routers and endpoints.
|-- core/         # Application configuration.
|-- models/       # Pydantic schemas and SQLAlchemy tables.
|-- services/     # Business logic for documents, queries, and workflows.
|-- main.py       # Main FastAPI application instance.
|-- requirements.txt
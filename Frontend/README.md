# Frontend: Visual Workflow Canvas 🎨

This directory contains the React frontend for the No-Code AI Workflow Builder. It provides the user interface for designing and interacting with intelligent workflows using a drag-and-drop canvas powered by React Flow.

---

## Features

-   **Component Palette:** A list of draggable nodes (User Query, KnowledgeBase, etc.).
-   **Interactive Canvas:** Supports dragging, dropping, connecting, and selecting nodes.
-   **Dynamic Configuration Panel:** A side panel that shows settings for the selected node.
-   **Chat Modal:** An interface to send queries to the built workflow and see results.

---

## Local Development Setup

### Prerequisites

-   Node.js (v18 or higher)
-   NPM or Yarn

### Setup Instructions

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    -   By default, the application is configured to connect to the backend API at `http://localhost:8000`. If your backend is running elsewhere, you can create a `.env.local` file to override the API base URL:
    ```
    VITE_API_BASE_URL=http://your-backend-url
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## Available Scripts

-   `npm run dev`: Starts the development server with Hot Module Replacement.
-   `npm run build`: Bundles the app for production.
-   `npm run preview`: Serves the production build locally.

---

## Project Structure
<code><pre>
```
/
|-- src/
|   |-- components/     # Main UI components (panels, modals).
|   |-- nodes/          # Custom React Flow node components.
|   |-- App.jsx         # Main application layout.
|   |-- main.jsx        # Application entry point. 
```
</code></pre>

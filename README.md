# RAG-based Chat Application

A web-based chat application that uses Retrieval-Augmented Generation (RAG) to provide intelligent responses based on web content. The application allows users to ingest URLs and ask questions about their content, providing accurate and context-aware answers.

## Features

- Web-based chat interface
- URL ingestion and content processing
- Intelligent question answering using RAG
- Vector-based semantic search
- Real-time response generation

## Tech Stack

### Backend
- **FastAPI**: Web framework for building APIs
- **Uvicorn**: ASGI server for running the application
- **Sentence Transformers**: For text embeddings
- **FAISS**: For efficient similarity search
- **Google Generative AI**: For response generation
- **BeautifulSoup**: For web scraping and content extraction

### Frontend
- HTML/CSS/JavaScript
- Jinja2 templating

## Prerequisites

- Python 3.8+
- Google Generative AI API key
- Internet connection for web scraping

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your Google Generative AI API key:
```
GOOGLE_API_KEY=your_api_key_here
```

## Running the Application

1. Start the server:
```bash
python main.py
```

2. Access the web interface:
Open your browser and navigate to:
```
http://localhost:8001/chat
```

## Usage

1. **Ingest a URL**:
   - Enter a URL in the provided field
   - The system will process and index the content

2. **Ask Questions**:
   - Type your question in the chat interface
   - The system will provide relevant answers based on the ingested content

3. **Reset Index**:
   - Use the reset functionality to clear the indexed content

## Project Structure

- `main.py`: Main application file with FastAPI routes
- `rag_system.py`: Core RAG implementation
- `vector_store.py`: Vector storage and search functionality
- `models.py`: Data models and schemas
- `templates/`: HTML templates
- `static/`: Static files (CSS, JavaScript)
- `requirements.txt`: Project dependencies

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
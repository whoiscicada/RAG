from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import List, Dict, Any
import requests
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
import pickle
from rag_system import RAGSystem
from models import URLRequest, QueryRequest

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup templates and static files
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize RAG system
rag_system = RAGSystem()

# API endpoints
@app.get("/")
def read_root():
    return {"message": "RAG API is running", "status": "healthy"}

@app.get("/chat")
async def chat_interface(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/ingest")
async def ingest_url(request: URLRequest):
    try:
        result = rag_system.ingest_url(request.url)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        )

@app.post("/query")
async def handle_query(request: QueryRequest):
    try:
        result = rag_system.query(request.question, request.url)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        )

@app.post("/reset")
async def reset_index():
    try:
        rag_system.vector_store.clear_index()
        return JSONResponse(
            content={"status": "success", "message": "Index has been reset."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

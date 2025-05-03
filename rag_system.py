import os
from typing import Dict, Any, Optional
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from bs4 import BeautifulSoup
import requests
from vector_store import FAISSVectorStore

class RAGSystem:
    def __init__(self):
        # Initialize Gemini
        api_key = os.getenv("API_KEY")
        if not api_key:
            raise ValueError("API_KEY environment variable not set")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        self.current_chat = None
        self.current_url = None
        
        # Initialize embedding model
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Initialize vector store
        self.vector_store = FAISSVectorStore()

    def scrape_url(self, url: str) -> str:
        try:
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
            
            # Get text
            text = soup.get_text()
            
            # Break into lines and remove leading and trailing space
            lines = (line.strip() for line in text.splitlines())
            # Break multi-headlines into a line each
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            # Drop blank lines
            text = ' '.join(chunk for chunk in chunks if chunk)
            
            return text
        except Exception as e:
            raise Exception(f"Failed to scrape URL: {str(e)}")

    def ingest_url(self, url: str) -> Dict[str, Any]:
        try:
            # Scrape the URL
            text = self.scrape_url(url)
            
            # Split text into chunks
            chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]
            
            # Generate embeddings
            embeddings = self.embedding_model.encode(chunks)
            
            self.vector_store.add_documents(
                documents=chunks,
                embeddings=embeddings,
                metadatas=[{"url": url} for _ in chunks]
            )
            
            # Create a new chat session for the new URL
            self.current_chat = self.model.start_chat(history=[])
            self.current_url = url
            
            return {"status": "success", "message": f"Processed {len(chunks)} chunks from {url}"}
        except Exception as e:
            raise Exception(f"Ingestion failed: {str(e)}")

    def query(self, question: str, url: Optional[str] = None) -> Dict[str, Any]:
        try:
            # If the URL has changed or no chat session exists, create a new one
            if url != self.current_url or self.current_chat is None:
                self.current_chat = self.model.start_chat(history=[])
                self.current_url = url
            
            query_embedding = self.embedding_model.encode(question)
            results = self.vector_store.search(query_embedding, k=3, filter_url=url)
            
            if not results['documents']:
                return {
                    "response": "I don't have enough information to answer this question.",
                    "sources": []
                }
            
            context = "\n\n".join([
                f"Source: {meta['url']}\nContent: {doc}"
                for doc, meta in zip(results['documents'], results['metadatas'])
            ])
            
            prompt = f"""You are a helpful AI assistant. Use the following context to answer the question.
If the answer isn't in the context, say you don't know or the data you have searched is not relevant. Be concise and accurate.
If the user asks for brief info about the page or what the page is about, find the brief info and give it to the user.

Context: {context}

Question: {question}"""
            
            response = self.current_chat.send_message(prompt)
            
            return {
                "response": response.text.strip(),
                "sources": list(set([m['url'] for m in results['metadatas']]))
            }
        except Exception as e:
            raise Exception(f"Query failed: {str(e)}") 
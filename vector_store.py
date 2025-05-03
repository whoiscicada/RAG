import os
import pickle
import numpy as np
import faiss
from typing import List, Dict, Any, Optional

class FAISSVectorStore:
    def __init__(self):
        self.index = None
        self.metadata = {}
        self.dimension = 384  # all-MiniLM-L6-v2 dimension
        self.index_file = "faiss_index.pkl"
        self.load_index()

    def load_index(self):
        if os.path.exists(self.index_file):
            with open(self.index_file, 'rb') as f:
                data = pickle.load(f)
                self.index = data['index']
                self.metadata = data['metadata']
        else:
            self.index = faiss.IndexFlatIP(self.dimension)

    def save_index(self):
        with open(self.index_file, 'wb') as f:
            pickle.dump({
                'index': self.index,
                'metadata': self.metadata
            }, f)

    def clear_index(self):
        self.index = faiss.IndexFlatIP(self.dimension)
        self.metadata = {}
        self.save_index()

    def add_documents(self, documents: List[str], embeddings: np.ndarray, metadatas: List[dict]):
        if not self.index:
            self.index = faiss.IndexFlatIP(self.dimension)
        
        # Clear existing documents for the same URL if they exist
        url = metadatas[0].get('url')
        if url:
            self.remove_documents_by_url(url)
        
        start_id = len(self.metadata)
        ids = list(range(start_id, start_id + len(documents)))
        
        self.index.add(embeddings)
        
        for idx, (doc, meta) in enumerate(zip(documents, metadatas)):
            self.metadata[ids[idx]] = {
                'text': doc,
                'metadata': meta
            }
        
        self.save_index()

    def remove_documents_by_url(self, url: str):
        """Remove all documents associated with a specific URL"""
        if not self.metadata:
            return
            
        # Find all document IDs for the given URL
        ids_to_remove = [id for id, data in self.metadata.items() 
                        if data['metadata'].get('url') == url]
        
        if not ids_to_remove:
            return
            
        # Remove from metadata
        for id in ids_to_remove:
            del self.metadata[id]
            
        # Rebuild the index
        if self.metadata:
            all_embeddings = []
            all_metadatas = []
            for id, data in self.metadata.items():
                all_embeddings.append(self.index.reconstruct(id))
                all_metadatas.append(data)
            
            self.index = faiss.IndexFlatIP(self.dimension)
            self.index.add(np.array(all_embeddings))
        else:
            self.index = faiss.IndexFlatIP(self.dimension)
            
        self.save_index()

    def search(self, query_embedding: np.ndarray, k: int = 5, filter_url: Optional[str] = None):
        if not self.index:
            return {'documents': [], 'metadatas': []}
        
        # If filter_url is provided, only search within that URL's documents
        if filter_url:
            relevant_ids = [id for id, data in self.metadata.items() 
                          if data['metadata'].get('url') == filter_url]
            if not relevant_ids:
                return {'documents': [], 'metadatas': []}
            
            # Create a temporary index with only relevant documents
            temp_index = faiss.IndexFlatIP(self.dimension)
            temp_embeddings = [self.index.reconstruct(id) for id in relevant_ids]
            temp_index.add(np.array(temp_embeddings))
            
            distances, indices = temp_index.search(np.array([query_embedding]), k)
            # Map back to original IDs and convert to list
            indices = [int(relevant_ids[i]) for i in indices[0]]
        else:
            distances, indices = self.index.search(np.array([query_embedding]), k)
            # Convert indices to list of integers
            indices = [int(idx) for idx in indices[0]]

        results = {'documents': [], 'metadatas': []}
        for idx in indices:
            if idx in self.metadata:
                meta = self.metadata[idx]
                results['documents'].append(meta['text'])
                results['metadatas'].append(meta['metadata'])

        return results 
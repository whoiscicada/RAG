from pydantic import BaseModel
from typing import Optional

class URLRequest(BaseModel):
    url: str

class QueryRequest(BaseModel):
    question: str
    url: Optional[str] = None 
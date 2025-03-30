from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import uvicorn
from pydantic import BaseModel
from typing import List, Optional
from urllib.parse import urlparse
import re
import json
import os

CONTENT_PATH = "id_to_content.json"

app = FastAPI()
model = SentenceTransformer("all-MiniLM-L6-v2")
INDEX_PATH = "index.bin"


class Content(BaseModel):
    userId: str
    title: str
    link: str
    type: str
    tags: Optional[List[str]] = []

def save_content_mappping():
    with open(CONTENT_PATH,"w") as f:
        json.dump(id_to_content,f)

def load_content_mapping():
    global id_to_content
    try:
        with open(CONTENT_PATH,"r") as f:
            id_to_content = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        id_to_content = {}

def load_faiss_index():
    global faiss_index
    if os.path.exists(INDEX_PATH):
        faiss_index = faiss.read_index(INDEX_PATH)
    else:
        faiss_index = None

def extract_keywords_url(url):
    parsed_url = urlparse(url)
    
    domain = parsed_url.netloc.replace("www.","")
    
    url_path_words = re.findall(r"[a-zA-Z0-9]+", parsed_url.path)
    
    stopwords = {"html","com","in","net","org","www","index","key","search"}
    
    keywords = [word for word in url_path_words if word.lower() not in stopwords]
    
    return domain," ".join(keywords)

@app.post("/update-search")
async def update_search(data: Content):
    global faiss_index
    global id_to_content

    print('recived',data)

    domain, keywords = extract_keywords_url(data.link)

    string_to_encode = f"{data.title} {' '.join(data.tags)} {domain} {keywords} {data.type}"
    print(string_to_encode)
    vector = model.encode([string_to_encode])
    dimension = vector.shape[1]

    if faiss_index is None:
        faiss_index = faiss.IndexFlatL2(dimension)

    content_id = faiss_index.ntotal
    id_to_content[str(content_id)] = data.model_dump()

    faiss_index.add(np.array(vector))
    faiss.write_index(faiss_index, INDEX_PATH)
    
    save_content_mappping()
    
    return {"message":"vector db updated","vecor_id" : faiss_index.ntotal}

class searchParama(BaseModel):
    query: str
    userId: str

@app.post("/search")
def search(body:searchParama):
    global id_to_content
    query_vector = model.encode([body.query])
    distances, indices = faiss_index.search(query_vector, 3)
    data = [id_to_content.get(str(i)) for i in indices[0] if str(i) in id_to_content]
    result = [obj for obj in data if obj.get("userId")==body.userId]
    return {"result":result}

def main():
    print("Starting FastAPI server...")
    
    load_faiss_index()
    load_content_mapping()

    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()
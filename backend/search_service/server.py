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
DELETED_IDS_PATH = "deletedIds.json"

app = FastAPI()
model = SentenceTransformer("all-MiniLM-L6-v2")
INDEX_PATH = "index.bin"


class Content(BaseModel):
    userId: str
    contentId: str
    faiss_Id: str
    title: str
    link: str
    type: str
    tags: Optional[List[str]] = []
    old_faiss_id: Optional[str] = None

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

def load_deleted_ids():
    global deleted_ids
    try:
        with open(DELETED_IDS_PATH,"r") as f:
            deleted_ids = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        deleted_ids = []

def save_deleted_ids():
    global deleted_ids
    with open(DELETED_IDS_PATH,"w") as f:
        json.dump(deleted_ids,f)

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
    global deleted_ids

    if(data.old_faiss_id != None):
        deleted_ids.append(data.old_faiss_id)
        save_deleted_ids()
    
    domain, keywords = extract_keywords_url(data.link)

    string_to_encode = f"{data.title} {' '.join(data.tags)} {domain} {keywords} {data.type}"
    vector = model.encode([string_to_encode])
    dimension = vector.shape[1]

    if faiss_index is None:
        faiss_index = faiss.IndexIDMap(faiss.IndexFlatL2(dimension))

    id_to_content[str(data.faiss_Id)] = {"contentId":data.contentId,"userId":data.userId,"tags":data.tags}

    faiss_index.add_with_ids(np.array(vector),np.array([int(data.faiss_Id)]))
    faiss.write_index(faiss_index, INDEX_PATH)
    
    save_content_mappping()
    return {"message":"vector db updated","faiss_id" : data.faiss_Id,"ntotal":faiss_index.ntotal}

class searchParama(BaseModel):
    query: str
    userId: str

class deletedPara(BaseModel):
    faiss_Id: str

@app.post("/search")
def search(body:searchParama):
    d_threshold = 1.35
    global id_to_content
    global faiss_index
    global deleted_ids

    query_vector = model.encode([body.query])
    distances, indices = faiss_index.search(query_vector, 50)
    filtered_results = [(i) for i, d in zip(indices[0], distances[0]) if d <= d_threshold]
    
    final_result = [str(i) for i in filtered_results if str(i) not in deleted_ids and id_to_content.get(str(i)).get("userId") == body.userId]

    tags_result = [i for i in id_to_content if body.query in id_to_content.get(str(i)).get("tags") and i not in final_result and str(i) not in deleted_ids and body.userId == id_to_content.get(str(i)).get("userId")]

    final_result.extend(tags_result)
    
    return {"result":str(final_result)}

@app.post("/delete-content")
def deleteContent(body: deletedPara):
    global deleted_ids
    deleted_ids.append(body.faiss_Id)
    save_deleted_ids()

def main():
    print("Starting FastAPI server...")
    
    load_faiss_index()
    load_content_mapping()
    load_deleted_ids()
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()
import os
import uuid

from repo.repo import Repository
from llm.llm_factory import LLMFactory
from llm.prompts import *
from embedding.embedding_factory import EmbeddingFactory
from util.splitter import *

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from qdrant_client.models import PointStruct

from dotenv import load_dotenv
load_dotenv(override=True)

class Repo(BaseModel):
    link: str

MODEL=os.environ['MODEL']
QDRANT_CLUSTER_ENDPOINT=os.environ['QDRANT_CLUSTER_ENDPOINT']
QDRANT_CLUSTER_API_KEY=os.environ['QDRANT_CLUSTER_API_KEY']

llm = LLMFactory.get_ollama_client()
qdrant_client = EmbeddingFactory.connect_client(QDRANT_CLUSTER_API_KEY, QDRANT_CLUSTER_ENDPOINT)

origins = ["*"]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def read_root() -> dict:
    return {"Hello": "World"}

@app.post("/submit")
def submit_repo(repo: Repo):
    repository = Repository(repo.link)
    repository.download()

    EmbeddingFactory.create_collection(llm, qdrant_client, MODEL, repository.name)
    
    points = []
    for file in repository.files:
        # BUG: This needs to be fixed. It's too slow.
        file.summary = llm.generate(model=MODEL, prompt=get_source_code_analysis_prompt(file.content)).response

        chunks = split_texts(file.summary)
        for chunk in chunks:
            point = EmbeddingFactory.create_embedding(llm=llm, model=MODEL, chunk=chunk, repo_name=repository.name, filename=file.name)
            points.append(point)
        
    EmbeddingFactory.save_embedding(client=qdrant_client, repo_name=repository.name, points=points)

    return {"llm_response": "test"}
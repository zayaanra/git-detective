import yaml
import os

from repo.repo import Repository
from llm.llm_factory import LLMFactory
from llm.prompts import *
from embedding.embedding_factory import EmbeddingFactory

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

    # for file in repository.files:
        # file.summary = llm.generate(model=MODEL, prompt=get_source_code_analysis_prompt(file.content)).response
        # with open(f"llm_summaries/{file.name}_summary.txt", "w", encoding="utf-8") as f:
        #     f.write(file.summary)
        

    return {"llm_response": "test"}
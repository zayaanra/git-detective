import os
import logging
import json

from repo.repo import Repository
from llm.llm_factory import LLMFactory
from llm.prompts import *
from embedding.embedding_factory import EmbeddingFactory
from util.splitter import *

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from concurrent.futures import ThreadPoolExecutor

from dotenv import load_dotenv
load_dotenv(override=True)

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
for noisy_logger in [
    "uvicorn",
    "uvicorn.access",
    "httpcore",
    "httpx",
    "asyncio",
    "starlette",
    "fastapi"
    "urllib3.connectionpool"
]:
    logging.getLogger(noisy_logger).setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

class Repo(BaseModel):
    link: str

class Question(BaseModel):
    question: str

FILE_CONTENT_LIMIT = 8000

MODEL=os.environ['MODEL']
QDRANT_CLUSTER_ENDPOINT=os.environ['QDRANT_CLUSTER_ENDPOINT']
QDRANT_CLUSTER_API_KEY=os.environ['QDRANT_CLUSTER_API_KEY']

llm = LLMFactory.get_ollama_client()
# qdrant_client = EmbeddingFactory.connect_client(QDRANT_CLUSTER_API_KEY, QDRANT_CLUSTER_ENDPOINT)

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
    repository.convert_to_xml()
    
    #prompt = get_repo_analysis_prompt(repository.context)
    # response = llm.generate(model=MODEL, prompt=prompt).response

    return {"response": ""}
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

    exists = EmbeddingFactory.create_collection(llm, qdrant_client, MODEL, repository.name)
    if not exists:
        def summarize_file(file):
            if file.name:
                truncated_content = file.content[:FILE_CONTENT_LIMIT]
                prompt = get_source_code_analysis_prompt(truncated_content)
                file.summary = llm.generate(model=MODEL, prompt=prompt).response
                return file

        with ThreadPoolExecutor(max_workers=8) as executor:
            results = executor.map(summarize_file, repository.files)
            summarized_files = [res for res in results if res]
        
        points = []
        for file in summarized_files:
            chunks = split_texts(file.summary)
            for chunk in chunks:
                point = EmbeddingFactory.create_embedding(
                    llm=llm,
                    model=MODEL,
                    chunk=chunk,
                    repo_name=repository.name,
                    filename=file.name
                )
                points.append(point)
        
        EmbeddingFactory.save_embedding(
            client=qdrant_client,
            repo_name=repository.name,
            points=points
        )

        return {"status": "completed"}

    return {"status": "collection %s already exists" % repository.name}

@app.post("/ask")
def ask_question(q: Question):
    question = q.question

    repo_name = "omnicode"

    search_result = EmbeddingFactory.search_collection(llm=llm, client=qdrant_client, model=MODEL, collection_name=repo_name, question=question)

    context_chunks = [hit.payload["text"] for hit in search_result]
    context_text = "\n\n".join(context_chunks)

    response = llm.generate(model=MODEL, prompt=get_question_answer_prompt(context_text, question)).response
    result = json.loads(response, strict=False)
    return {
        "answer": result["answer"],
        "flowchart": result["flowchart"]
    }
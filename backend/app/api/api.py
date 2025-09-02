import logging

from repo.repo import Repository
from llm.llm_factory import GenAI
from llm.prompts import *

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

llm = GenAI()

@app.get("/")
async def read_root() -> dict:
    return {"Hello": "World"}

@app.post("/submit")
def submit_repo(repo: Repo):
    repository = Repository(repo.link)
    success = repository.download()
    repository.convert_to_xml()

    if success:
        return JSONResponse(content={"message": f"Connected to repository: {repository.name}"}, status_code=200)

    else:
        return JSONResponse(content={"message": f"Failed to find repository: {repository.name}. Please try again."}, status_code=400)
    
@app.post("/ask")
def ask(q: Question):
    question = Question(q.question)
    llm.ask(question, context="")

    # TODO - maintain session somehow so we know which repo is being asked about
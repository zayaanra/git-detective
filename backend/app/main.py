import uvicorn
import logging

from repository.schemas import *
from repository.repository import *
from repository.file import *

from llm.llm_factory import GenAI
from llm.prompts import *

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

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
def submit_repo(r: Repo):
    repository = Repository(r.owner, r.name)
    status_code = repository.download()
    repository_info = repository.convert_to_json()

    if status_code == 200:
        return JSONResponse(content={
            "message": f"Connected to repository: {repository.name}", 
            "repository_info": repository_info, 
            }, 
            status_code=status_code
        )
    else:
        return JSONResponse(content={
            "message": f"Failed to find repository: {repository.name}. Please try again."}, 
            status_code=status_code
        )
    
@app.post("/ask")
def ask(q: Question):
    question = Question(q.question)
    llm.ask(question, context="")

    # TODO - maintain session somehow so we know which repo is being asked about

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
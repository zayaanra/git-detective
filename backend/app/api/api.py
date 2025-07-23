from repo.repo import Repository
from llm.llm_factory import LLMFactory
from llm.prompts import *

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Repo(BaseModel):
    link: str

llm = LLMFactory.get_ollama_client()
model = "codellama-CodeAnalyst"

@app.get("/")
async def read_root() -> dict:
    return {"Hello": "World"}

@app.post("/submit")
def submit_repo(repo: Repo):
    repository = Repository(repo.link)
    repository.download()

    llm_response = []
    for file in repository.files:
        filename = file.name
        code = file.content

        response = llm.generate(model=model, prompt=get_source_code_analysis_prompt(filename, code))
        llm_response.append(response)

    return {"llm response": llm_response}
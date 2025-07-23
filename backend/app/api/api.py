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

@app.get("/")
async def read_root() -> dict:
    return {"Hello": "World"}

@app.post("/submit")
def read_repo_link(repo: Repo):
    return {"repo link": repo.link}
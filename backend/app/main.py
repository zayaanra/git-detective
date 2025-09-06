import uvicorn
import logging
import secrets
import redis

from fastapi import FastAPI, Cookie
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from repository.schemas import *
from repository.repository import *
from repository.file import *
from llm.llm_factory import GenAI

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
    "fastapi",
    "urllib3.connectionpool",
    "watchfiles.main"
]:
    logging.getLogger(noisy_logger).setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

redis_client = redis.Redis(host="localhost", port=6379, decode_responses=True)
llm_client = GenAI()

@app.post("/connect")
def connect_to_repo(r: Repo):
    repository = Repository(r.owner, r.name)
    status_code = repository.download()
    repository_info = repository.convert_to_json()

    session_id = secrets.token_urlsafe(16)
    redis_client.set(session_id, json.dumps(repository_info))

    if status_code == 200:
        response = JSONResponse(content={"message": f"Connected to repository: {repository.name}", "session_id": session_id}, status_code=status_code)
        response.set_cookie(
            key="sessionID",
            value=session_id,
            httponly=True,
            samesite="None",
            secure=True
        )
        return response
    
    return JSONResponse(content={"message": f"Failed to find repository: {repository.name}. Please try again."}, status_code=status_code)

@app.post("/disconnect")
def disconnect_from_repo(sessionID: str = Cookie(None)):
    if not sessionID:
        return JSONResponse(content={"error": "Session ID missing"}, status_code=400)
    
    redis_client.delete(sessionID)

    response = JSONResponse(content={"message": "Disconnected from repository"}, status_code=200)
    response.delete_cookie("sessionID")
    return response


@app.post("/query")
def query_repo(q: Question, sessionID: str = Cookie(None)):
    if not llm_client:
        return JSONResponse(content={"error": "LLM client not initialized"}, status_code=500)
    
    if not sessionID:
        return JSONResponse(content={"error": "Session ID missing"}, status_code=400)
    
    context = redis_client.get(sessionID)    
    answer = llm_client.query(context, q.text)
    return JSONResponse(content={"answer": answer}, status_code=200)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
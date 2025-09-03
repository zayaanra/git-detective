from pydantic import BaseModel

class SessionData(BaseModel):
    connected: bool
    repository_url: str
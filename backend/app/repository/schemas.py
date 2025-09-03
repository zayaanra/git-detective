from pydantic import BaseModel

class Repo(BaseModel):
    owner: str
    name: str

class Question(BaseModel):
    text: str
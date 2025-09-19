import os

from google import genai

from dotenv import load_dotenv
load_dotenv(override=True)

GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]

class GenAI():
    def __init__(self, model: str = "gemini-2.5-flash"):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = model
    
    def query(self, context: str, question: str) -> str:
        response = self.client.models.generate_content(
            model=self.model,
            contents=[
                {"role": "user", "parts": [{"text": question}]},
                {"role": "user", "parts": [{"text": context}]},
            ]
        )

        return response.text
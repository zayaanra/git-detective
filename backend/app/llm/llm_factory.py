import os

from google import genai

from dotenv import load_dotenv
load_dotenv(override=True)

GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]

class GenAI():
    def __init__(self, model: str = "gemini-2.5-flash"):
        self.model = model
        
        self.client = genai.Client(api_key=GEMINI_API_KEY)
    
    def ask(self, question: str, context: str) -> str:
        response = self.client.models.generate_content(
            model=self.model,
            contents=[
                "Please analyze the following XML file:",
                context,
                question
            ]
        )

        print(response.text)

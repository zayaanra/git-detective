import requests
import os
import json

from .file import File

from dotenv import load_dotenv
load_dotenv(override=True)

GITHUB_ACCESS_TOKEN = os.environ['GITHUB_ACCESS_TOKEN']

ALLOWED_LANGUAGES = [".py", ".js", ".java", ".go", ".rs", ".html", ".css"]

# TODO - consider directories/files that should be disallowed for parsing
DISALLOWED_DIRS = ["node_modules", "__pycache__", "venv"]
DISALLOWED_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".tiff", ".psd", ".raw", ".bmp", ".heif", ".indd", ".svg", ".ai", ".eps", ".pdf"]

class Repository:
    GITHUB_BASE_URL = "https://api.github.com"
    RAW_GITHUB_BASE_URL = "https://raw.githubusercontent.com"

    """
    Repository class that holds all the following information about a GitHub repository: Owner, Repository Name, URL, and each File.
    """

    """
    Initializes the Repository object with the submitted repository owner and name

    Args:
        owner (str): The owner of the repository
        name (str): The name of the repository
    """
    def __init__(self, owner: str, name: str):
        self.owner, self.name = owner, name

        self.url = f"{self.GITHUB_BASE_URL}/repos/{owner}/{name}/git/trees/main?recursive=1"
        self.files: list[File] = []

    """
    Downloads the content and other information of a single repository.

    Returns:
        int: Represents the status code of the request made to the GitHub repository. A successful request should return 200.
    """
    def download(self) -> bool:
        response = requests.get(self.url, headers={"Authorization": f"Bearer {GITHUB_ACCESS_TOKEN}"})
        if response.status_code == 200:
            objects = response.json()
            for obj in objects['tree']:
                file = File(path=obj['path'], type=obj['type'], sha=obj['sha'], size=obj.get('size', None))
                if file.type == "blob":
                   file.content = requests.get(f"{self.RAW_GITHUB_BASE_URL}/{self.owner}/{self.name}/refs/heads/main/{file.path}").text
                self.files.append(file)
        
        return response.status_code

    """
    Converts the information of the repository to a single JSON file format

    Returns:
        dict: Repository information condensed into a single Python dictionary
    """
    def convert_to_json(self) -> str:
        repository_info = {"id": f"{self.owner}/{self.name}", "directory_structure": [], "files": []}
        for file in self.files:
            repository_info["directory_structure"].append(file.path)
            if file.type == "blob":
                repository_info["files"].append(
                    {
                        "file": {
                            "path": file.path,
                            "content": file.content
                        }

                    }
                )
        return repository_info
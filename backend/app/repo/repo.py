import requests
import zipfile
import io
import os

from pathlib import Path

from .file import File

class Repository:
    """
    Repository class that holds all the following information about a GitHub repository: Owner, Repository Name, URL, and each File.
    """

    """
    Initializes the Repository object with the submitted repository link

    Args:
        link (str): A link pointing to the GitHub repository
    """
    def __init__(self, link: str):
        parts = link.split("/")

        self.owner = parts[-2]
        self.name = parts[-1]

        self.url = f"https://github.com/{self.owner}/{self.name}/archive/main.zip"
        
        self.files: list[File] = []

    
    """
    Downloads the content and other information of a single repository.
    """
    def download(self):
        response = requests.get(self.url)
        z = zipfile.ZipFile(io.BytesIO(response.content))
        
        for filename in z.namelist():
            suffix = Path(filename).suffix
            if suffix and suffix not in ['.js', '.md', '.mjs', '.json']:
                with z.open(filename) as f:
                    info = z.getinfo(filename)
                    content = f.read().decode("utf-8")
                    self.files.append(File(path=filename, size=info.file_size, content=content))
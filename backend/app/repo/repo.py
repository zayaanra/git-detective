import requests

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
        self.repo = parts[-1]

        self.url = f"https://api.github.com/repos/{self.owner}/{self.repo}"
        
        self.files: list[File] = []

    
    """
    Downloads the content and other information of a single repository.
    """
    def download(self):
        url = f"{self.url}/git/trees/main?recursive=1"
        response = requests.get(url)
        response.raise_for_status()

        for f in response.json()["tree"]:
            if f["type"] == "blob":
                file = File(path=f["path"], type=f["type"], size=f["size"], url=f["url"])
                
                sha = f.sha
                blob_url = f"{self.url}/git/blobs{sha}"
                response = requests.get(blob_url, headers={"Accept": "application/vnd.github.v3.raw"})
                response.raise_for_status()

                file.content = response.content

                self.files.append(file)
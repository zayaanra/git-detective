import os
import pathlib

class File:
    """
    Class representing a GitHub repository file. It contains information such as: path (relative to the repository), type (blob), sha (hash), size, URL, and content.
    """

    """
    Instanties a GitHub file object.

    Args:
        path (str): The path of where this file is stored in the GitHub repository
        type (str): Must be a blob as all files are blobs
        sha (str): The hash of the file
        size (str): The size of the file
        url (str): The URL pointing to this file in the GitHub repository
    """
    def __init__(self, path: str, type: str, sha: str, size: str, url: str):
        self.path = path
        self.name = os.path.basename(path)
        self.ext = pathlib.Path(path).suffix
        
        self.type = type
        self.sha = sha

        self.size = size

        self.url = url

        self.content = None
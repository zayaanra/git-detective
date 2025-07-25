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
        size (str): The size of the file
        content (str): The content of the file
    """
    def __init__(self, path: str, size: str, content: str):
        self.path = path
        self.name = os.path.basename(path)
        self.ext = pathlib.Path(path).suffix
        
        self.size = size

        self.content = content
        self.summary = None
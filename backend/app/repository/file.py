import os
import pathlib

class File:
    """
    Class representing a GitHub repository file. It contains information such as: path (relative to the repository), type (blob), sha (hash), size, and content.
    """

    """
    Instanties a GitHub file object.

    Args:
        path (str): The path of where this file is stored in the GitHub repository
        type (str): Blob or tree
        sha (str): The sha hash of the object
        size (str | None): Size of the file - set to None if it is a directory
        content (str | None): The content of the file - set to None if it is a directory
    """
    def __init__(self, path: str, type: str, sha: str, size: str | None = None, content: str | None = None):
        self.name = os.path.basename(path)
        self.path = path
        self.type = type
        self.sha = sha
        self.size = size
        self.content = content

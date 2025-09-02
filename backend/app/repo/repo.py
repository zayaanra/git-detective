import requests
import zipfile
import io

from pathlib import Path
from xml.etree import ElementTree as ET

from .file import File

ALLOWED_LANGUAGES = [".py", ".js", ".java", ".go", ".rs", ".html", ".css"]

DISALLOWED_EXTS = [".png", ".jpeg", ".jpg"]

# TODO - consider directories/files that should be disallowed for parsing

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

        # TODO - use regex to determine if repo link is valid

        self.owner, self.name = parts[-2], parts[-1]
        self.url = f"https://github.com/{self.owner}/{self.name}/archive/main.zip"
        self.files: list[File] = []

    """
    Downloads the content and other information of a single repository.
    """
    def download(self) -> bool:
        response = requests.get(self.url)
        if response.status_code == 404:
            return False
            
        z = zipfile.ZipFile(io.BytesIO(response.content))

        for filename in z.namelist():
            suffix = Path(filename).suffix
            if filename.endswith("/"):
                # NOTE - better values could be used for content and size if it is a directory
                self.files.append(File(path=filename, size="0", content=""))
            else:

                if suffix not in DISALLOWED_EXTS:
                    with z.open(filename, mode='r') as f:
                        info = z.getinfo(filename)
                        content = f.read().decode()
                        self.files.append(File(path=filename, size=info.file_size, content=content))

        return True

    """
    Converts the information of the repository to a single XML file format
    """
    def convert_to_xml(self):
        xml_string = ""

        directory_structure_tag = ""
        files_tag = ""

        for file in self.files:
            directory_structure_tag += f"{file.path}\n"
            files_tag += f"<file path={file.path}>\n"
            files_tag += f"{file.content}\n"
            files_tag += f"</file>\n"

        xml_string += "<directory_structure>\n"
        xml_string += directory_structure_tag
        xml_string += "</directory_structure>\n"

        xml_string += "<files>\n"
        xml_string += files_tag
        xml_string += "</files>\n"

        # with open("repo_xml_test.xml", "w") as f:
        #     f.write(xml_string)
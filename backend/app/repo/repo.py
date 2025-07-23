import requests

class Repository:
    def __init__(self, link):
        self.link = link

    def download(self):
        parts = self.link.split("/")
        owner, repo = parts[-2], parts[-1]
        url = f"https://api.github.com/repos/{owner}/{repo}"
        print(url)
        response = requests.get(url)

        print(response.json())

        


def main():
    repo = Repository("https://github.com/zayaanra/omnicode")
    repo.download()


if __name__ == "__main__":
    main()


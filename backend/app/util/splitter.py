from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_texts(document: str) -> list[str]:
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=0)
    return text_splitter.split_text(document)
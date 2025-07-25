import logging
import ollama

from qdrant_client import QdrantClient   
from qdrant_client.models import VectorParams, Distance 

class EmbeddingFactory:
    """
    A static class that provides an interface for interacting with vector embeddings within Ollama and Qdrant.
    """

    """
    Connects to the Qdrant vector DB

    Args:
        api_key (str): The API key required to connect to the Qdrant vector DB
        qdrant_url (str): The URL of the Qdrant vector DB
    
    Returns:
        QdrantClient: The Qdrant client
    """
    @staticmethod
    def connect_client(api_key, qdrant_url: str) -> QdrantClient:
        client = None
        try:
            client = QdrantClient(api_key=api_key, url=qdrant_url)
            logging.info("Initialized Qdrant client")
        except Exception as e:
            logging.exception(f"Error when connecting to Qdrant: {e}")
        return client
    
    """
    Disconnects from the Qdrant vector DB
    
    Args:
        client (QdrantClient): The Qdrant client
    """
    @staticmethod
    def disconnect_client(client: QdrantClient):
        try:
            client.close()
            logging.info("Disconnected from Qdrant")
        except Exception as e:
            logging.exception(f"Error when disconnecting from Qdrant: {e}")

    @staticmethod
    def create_embedding():
        # TODO
        pass

    @staticmethod
    def save_embedding():
        # TODO
        pass

    """
    Creates a collection in the Qdrant vector DB

    Args:
        llm (ollama.Client): The LLM
        client (QdrantClient): The Qdrant client
        model (str): The model used for both the LLM and embedding
        collection_name (str): The name of the collection to be created
    """
    @staticmethod
    def create_collection(llm: ollama.Client, client: QdrantClient, model: str, collection_name: str):
        sample = ''' \
        This Python script defines a serverless workflow for generating code completions using a SageMaker model and tracking usage through AWS services. It is designed to run as an AWS Lambda function, receiving code snippets as input and returning generated code suggestions.
        The core component is the CodeAssistant class, which initializes a connection to a SageMaker endpoint using the AWS SDK (boto3). The complete_code method sends a code snippet along with generation parameters such as max_tokens and temperature to the endpoint. It then parses the JSON response and extracts the generated code. 
        There's also a method, suggest_multiple_completions, which invokes the endpoint multiple times to generate different variations of code completions.
        To track usage, the script includes a send_metrics_to_sqs function that formats and sends a message containing metadata—like user ID, code language, timestamp, and the size of the generated completion in bytes—to an SQS queue.
        Finally, the lambda_handler function acts as the Lambda entry point. It initializes the CodeAssistant, retrieves the code snippet from the input event, generates a completion, sends usage metrics to the SQS queue, and returns the result in an HTTP-like response. If an error occurs, it logs the issue and returns a 500 error status.'''

        response = llm.embeddings(model=model, prompt=sample)
        vector_size = len(response['embedding'])

        try:
            client.recreate_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=vector_size,
                    distance=Distance.COSINE
                )
            )
            logging.info(f"Created collection: {collection_name}")
        except Exception as e:
            logging.exception(f"Error when creating collection: {e}")
    
    """
    Deletes a collection in the Qdrant vector DB

    Args:
        client (QdrantClient): The QdrantClient
        collection_name (str): The name of the collection to be deleted
    """
    @staticmethod
    def delete_collection(client: QdrantClient, collection_name: str):
        try:
            client.delete_collection(collection_name=collection_name)
            logging.info(f"Deleted collection: {collection_name}")
        except Exception as e:
            logging.exception(f"Error when deleting collection: {e}")

    """
    Fetches a collection from the Qdrant vector DB

    Args:
        client (QdrantClient): The QdrantClient
        collection_name (str): The name of the collection to be fetched

    Returns:
        collection: The actual Qdrant vector DB collection
    """
    @staticmethod
    def get_collection(client: QdrantClient, collection_name: str):
        try:
            client.get_collection(collection_name=collection_name)
            logging.info(f"Fetched collection: {collection_name}")
        except Exception as e:
            logging.exception(f"Error when fetching collection: {e}")
    
    @staticmethod
    def search_collection():
        # TODO
        pass


    

import ollama

class LLMFactory:
    """
    LLMFactory represents all possible LLM instances that can be returned. Ollama is the only supported method of retrieving a LLM model.
    Static methods are used to reduce the number of times an LLM is instantiated.
    """

    """
    Fetches the Ollama client
    """
    @staticmethod
    def get_ollama_client() -> ollama.Client:
        client = ollama.Client()
        return client
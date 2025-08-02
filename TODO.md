### Todo
- [ X ] Design a Qdrant vector database in accordance with Ollama custom model
  - [ X ] Use LLM to summarize each file, then chunk and embed each summary in Qdrant vector DB
      - [ X ] Think of better way to chunk each file - maybe each summary is one chunk only
- [ X ] Design a minimal frontend to make testing easier
- [ ] Figure out a way for LLM to output UML diagram in form on JSON schema
- [ ] Ollama is designed only for local use, so it should be hosted somewhere on the cloud (e.g: AWS EC2 instance)
- [ ] Ollama is currently too slow. Sending a request for every file is taking too long, how can we speed this up?
- [ ] Make API calls from frontend to backend
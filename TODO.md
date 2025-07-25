### Todo
- [ ] Design a Qdrant vector database in accordance with Ollama custom model
  - [ ] Chunk and vectorize each file in GitHub repository
  - [ ] Use LLM to summarize each file, then chunk and embed each summary in Qdrant vector DB
- [ ] Design a minimal frontend to make testing easier
- [ ] Figure out a way for LLM to output UML diagram in form on JSON schema
- [ ] Ollama is designed only for local use, so it should be hosted somewhere on the cloud (e.g: AWS EC2 instance)
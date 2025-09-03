### Todo
## Backend
- [ ] Improve how logging is currently done
- [X] Download repository and condense into one single XML format
  - [X] Tags like <directory_structure>, <files> <file path="path"> // file contents here </file> </files>, should be considered
- [ ] Store session data to remember connected GitHub repository for each user
  - [ ] Implement a simple in-memory session storage
    - [ ] Generate session ID on backend when connected to repository
    - [ ] Store session ID on frontend upon response from original request
    - [ ] Verify session ID on backend
      - [ ] If successful, need to pull out corresponding repository information from object store (S3)
      - [ ] If failed, return response stating: session expired, reconnect to repository.
  - [ ] Store repository information in an object-store such as S3
    - [ ] Upon collecting repository info and storing session ID, data should be sent to S3 for session storage

## Frontend
- [ ] Allow user for option to list files that should be ignored when collecting repository information
- [ ] When user connects to repository, width of components should not suddenly change
- [ ] Provide output box for JSON summary of entire repository

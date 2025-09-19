### To-Do
## Backend
- [ ] Improve how logging is currently done
- [X] Download repository and condense into one single JSON format
- [X] Store session data to remember connected GitHub repository for each user

## Frontend
- [ ] Allow user for option to list files that should be ignored when collecting repository information
- [ ] When user connects to repository, width of components should not suddenly change
- [ ] Provide output box for JSON summary of entire repository
- [ ] Finish components for LLM Q/A on repository
  - [X] Fix fade in/out bug when QA component flashes before fade animation
  - [X] Add disconnect functionality
  - [ ] Update color scheme of components
  - [ ] Store chat session as long as user is connected
  - [ ] Display info/warning stating that chat session/context is not saved anywhere
  - [X] Merge Q/A component with Connector component
- [ ] Connector component should be updated to have:
  - [X] Q/A
    - [ ] Complete Q/A component
  - [ ] Include/Exclude entries to include/exclude files or directories given a pattern
  - [ ] Initial connection should display basic repository info: (name, owner, authors/contributors, total # of files, etc...)
  - [ ] Ability to download JSON output of repository

## Bugs
- [ ] Regex for validating repository url (<username>/<repository>) breaks when repository name has non-alphanumeric characters
- [ ] Querying repository through GitHub API does not work if `main` branch is named `master` instead

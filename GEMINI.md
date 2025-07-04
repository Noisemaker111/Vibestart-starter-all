## 1. Project Structure and Management

* Continuously maintain and update the `<filetree.mdc>` file to reflect all changes promptly.
* Always reference `<filetree.mdc>` for understanding the project's current structure and ensuring contextually relevant code outputs.
* Immediately rename files, folders, functions, and variables proactively to improve readability and clarity.
* Maintain a structured and detailed to-do list to effectively manage and track tasks.

## 2. Coding Conventions and Best Practices

* Strictly adhere to naming conventions:

  * Variables and functions: camelCase
  * Components and types: PascalCase
  * Files and folders: kebab-case
  * Constants: UPPER\_SNAKE\_CASE
* Immediately remove unused code and always use async/await for asynchronous operations.
* Centralize interval and timer constants into dedicated constants files.
* Isolate rate-limit logic in separate, clearly defined files rather than embedding it within components.
* Place type definitions directly adjacent to relevant code.
* Avoid comments in code; code must be self-explanatory and clear enough without additional commentary.

## 3. Quality, Security, and Debugging

* Ensure exhaustive error handling, validating all inputs and outputs with Zod at API boundaries.
* Employ safe failure mechanisms to protect project stability.
* Clearly mark the beginning and end of operations using explicit debugging statements (e.g., console.log).
* Regularly consult project documentation before commencing new tasks to ensure contextual accuracy.

## 4. Responsiveness and Workflow

* Provide continuous and visible action, responding promptly to user commands.
* Execute npm scripts accurately upon user request for running or stopping the project.
* Maintain structured task TODOs, updating their status upon task completion.

## 5. Tech Stack Awareness

* Always refer to the provided `<techstack.mdc>` for accurate and context-aware code creation.
* Stay informed about and strictly adhere to the established technology stack
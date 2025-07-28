# Full-stack Application

Backend (Go):
- Web Framework: Fiber (gofiber/fiber/v2) - a fast Express-inspired web framework
- Database: MongoDB with the official Go driver (go.mongodb.org/mongo-driver)
- Environment Variables: godotenv for loading .env configuration files
- Hot Reload: Using Air (air.toml) for development with auto-reload
- API: RESTful API design with CRUD operations for todo items
- CORS: Implemented for allowing frontend access

Frontend (React):
- Framework: React 19 with TypeScript
- Build Tool: Vite for fast development and optimized builds
- UI Library: Chakra UI for styled components and theming
- State Management: React Query (TanStack Query) for server state management
- Icons: React Icons library
- Path Aliases: vite-tsconfig-paths for clean imports
- TypeScript: For type safety throughout the application
- Testing:
  + Vitest: Modern test framework optimized for Vite projects
  + React Testing Library: For testing components from a user perspective
  + JSDOM: Browser-like environment for testing
  + Component/API Mocking: For isolated unit testing

Application Structure:
- Todo application with features to create, list, update (mark complete), and delete tasks
- MongoDB stores the todos with fields for ID, body text, and completion status
- React components organized into modular files (Navbar, TodoForm, TodoList, TodoItem)
- Environment-aware configuration (development vs production)


< ------------------------------------------------------------------------------------------------------ >


1. What is Unit Testing and How it Works
- Unit Testing is a software testing method where individual "units" of code are tested in isolation to verify they work as designed.

Basic operation:
- Set up the test environment (setup)
- Execute actions (act)
- Check results (assert)
- Clean up the environment (cleanup)

In React, unit tests typically focus on:
- Components: testing correct UI rendering, props handling, state
- Hooks: testing state logic and side effects
- Functions: testing business logic, calculations

2. Basis for Thinking of Test Cases

2.1 Feature Analysis
- Basic functionality: What does each component do?
- Processing flows: What happens when users interact?
- Different states: How does the component display in each state?

2.2 AAA Principle (Arrange-Act-Assert)
- Arrange: Prepare data, mock dependencies
- Act: Perform the action to be tested (click, input...)
- Assert: Check results (UI, state, API calls...)

2.3 Test from the User's Perspective
As in this project:
- TodoItem: test display, distinguish completed/not completed
- TodoForm: test data input, form submission
- TodoList: test loading/empty/data display

2.4 Focus on Risk Points
- API calls: Mock to avoid dependence on real servers
- Side effects: Handle asynchronous processing
- Dependencies: Mock to control the environment
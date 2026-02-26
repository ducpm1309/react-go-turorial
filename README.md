# Full-stack Todo Application

## Backend (Go)

### Technologies
- Web Framework: Fiber (gofiber/fiber/v2) - a fast Express-inspired web framework 
- Database: MongoDB with the official Go driver (go.mongodb.org/mongo-driver)
- Environment Variables: godotenv for loading .env configuration files
- Hot Reload: Using Air (air.toml) for development with auto-reload
- API: RESTful API design with CRUD operations for todo items
- CORS: Implemented for allowing frontend access

### Setup & Installation

#### Prerequisites
- Go 1.20+ installed
- MongoDB Atlas account or local MongoDB instance
- Air (optional, for hot reload)

#### Configuration
1. Clone the repository
2. Create a `.env` file in the root directory with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000 # or your preferred port
```

#### Running the Backend
1. Install dependencies:
```bash
go mod tidy
```

2. Run with Air (hot reload):
```bash
air
```
OR without Air:
```bash
go run main.go
```

### API Endpoints

| Method | Endpoint     | Description            | Request Body                    | Response                          |
|--------|-------------|------------------------|---------------------------------|-----------------------------------|
| GET    | /api/todos  | Get all todos         | -                               | Array of todo objects             |
| POST   | /api/todos  | Create a new todo     | `{"body": "Task description"}`  | Created todo object               |
| PATCH  | /api/todos/:id | Mark todo as completed | -                           | `{"success": true}`               |
| DELETE | /api/todos/:id | Delete a todo      | -                               | `{"success": true}`               |

## Frontend (React):
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

## Application Structure:
- Todo application with features to create, list, update (mark complete), and delete tasks
- MongoDB stores the todos with fields for ID, body text, and completion status
- React components organized into modular files (Navbar, TodoForm, TodoList, TodoItem)
- Environment-aware configuration (development vs production)

## Project Structure
```
react-go/
  ├── air.toml              # Air configuration for hot reload
  ├── client/               # React frontend application
  ├── mcp-server/           # MCP server (Todo API as AI tools)
  ├── go.mod                # Go module definition
  ├── go.sum                # Go module checksum
  ├── main.go               # Go backend entry point
  ├── MCP_SERVER_GUIDE.md   # Hướng dẫn MCP server
  └── tmp/                  # Temporary directory used by Air
```

## Running the Full Application

### Development Mode
1. Start the backend: 
```bash
air
```
2. In another terminal, start the frontend:
```bash
cd client
npm run dev
```
3. Open your browser at http://localhost:5173

### Production Mode
1. Build the frontend:
```bash
cd client
npm run build
```
2. Start the backend (which will serve the frontend):
```bash
go run main.go
```
3. Open your browser at http://localhost:5000

### MCP Server (optional)

To let AI assistants (e.g. Cursor, Claude Desktop) manage todos via MCP tools, see [MCP_SERVER_GUIDE.md](MCP_SERVER_GUIDE.md).

**Quick test (no Cursor needed):**
1. Start the Go backend: `air` or `go run main.go` (keep it running).
2. In another terminal: `cd mcp-server && npm install && npm run build && npm run test:mcp` — this runs a script that calls the MCP server and prints `list_todos` result.
3. To use in Cursor: add the MCP server to Cursor settings (see the guide), then ask the AI e.g. "list my todos" or "add a todo: buy milk".

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
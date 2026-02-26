/**
 * Todo MCP Server – Exposes Go/Fiber Todo API as MCP tools for AI assistants (e.g. Cursor, Claude).
 * Ensure the Go backend is running on API_URL (default http://localhost:5000) before using these tools.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_URL = process.env.TODO_API_URL ?? "http://localhost:5000";
const API_BASE = `${API_URL}/api`;

type Todo = { _id: string; body: string; completed: boolean };

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

async function apiPatch(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, { method: "PATCH" });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
}

async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
}

const server = new Server(
  {
    name: "todo-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_todos",
      description:
        "List all todo items from the Todo API. Returns id, body, and completed status for each.",
      inputSchema: {
        type: "object" as const,
        properties: {},
      },
    },
    {
      name: "create_todo",
      description: "Create a new todo item. Requires a non-empty body (text).",
      inputSchema: {
        type: "object" as const,
        properties: {
          body: {
            type: "string",
            description: "Content of the todo item",
          },
        },
        required: ["body"],
      },
    },
    {
      name: "complete_todo",
      description: "Mark a todo as completed by its ID.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "string",
            description: "MongoDB ObjectID of the todo (e.g. from list_todos)",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "delete_todo",
      description: "Delete a todo by its ID.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "string",
            description: "MongoDB ObjectID of the todo",
          },
        },
        required: ["id"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const safeArgs = (args as Record<string, unknown>) ?? {};

  try {
    switch (name) {
      case "list_todos": {
        const todos = await apiGet<Todo[]>("/todos");
        const text =
          todos.length === 0
            ? "No todos yet."
            : todos
                .map(
                  (t) =>
                    `- [${t.completed ? "x" : " "}] ${t.body} (id: ${t._id})`
                )
                .join("\n");
        return { content: [{ type: "text" as const, text }] };
      }

      case "create_todo": {
        const body = String(safeArgs.body ?? "").trim();
        if (!body) {
          return {
            content: [{ type: "text" as const, text: "Error: body is required and cannot be empty." }],
            isError: true,
          };
        }
        const created = await apiPost<Todo>("/todos", { body, completed: false });
        return {
          content: [
            {
              type: "text" as const,
              text: `Created todo: "${created.body}" (id: ${created._id})`,
            },
          ],
        };
      }

      case "complete_todo": {
        const id = String(safeArgs.id ?? "").trim();
        if (!id) {
          return {
            content: [{ type: "text" as const, text: "Error: id is required." }],
            isError: true,
          };
        }
        await apiPatch(`/todos/${id}`);
        return {
          content: [{ type: "text" as const, text: `Todo ${id} marked as completed.` }],
        };
      }

      case "delete_todo": {
        const id = String(safeArgs.id ?? "").trim();
        if (!id) {
          return {
            content: [{ type: "text" as const, text: "Error: id is required." }],
            isError: true,
          };
        }
        await apiDelete(`/todos/${id}`);
        return {
          content: [{ type: "text" as const, text: `Todo ${id} deleted.` }],
        };
      }

      default:
        return {
          content: [{ type: "text" as const, text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text" as const, text: `Error: ${message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Todo MCP server running on stdio.");

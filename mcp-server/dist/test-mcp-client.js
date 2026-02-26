/**
 * Script test MCP server: spawn server, gọi list_todos và in kết quả.
 * Chạy từ thư mục mcp-server. Cần Go backend đang chạy tại http://localhost:5000.
 *
 * Cách chạy: npm run build && npm run test:mcp
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, "index.js");
async function main() {
    console.log("Starting MCP server process...");
    const transport = new StdioClientTransport({
        command: "node",
        args: [serverPath],
        env: { ...process.env, TODO_API_URL: process.env.TODO_API_URL || "http://localhost:5000" },
    });
    const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
    await client.connect(transport);
    console.log("Connected to Todo MCP server.\n");
    // 1. List tools
    const { tools } = await client.listTools();
    console.log("Tools:", tools.map((t) => t.name).join(", "));
    // 2. Call list_todos
    console.log("\nCalling list_todos...");
    const result = await client.callTool({ name: "list_todos", arguments: {} });
    const content = result.content;
    const textBlock = content?.find((c) => c.type === "text");
    if (textBlock && "text" in textBlock && textBlock.text) {
        console.log("Result:\n" + textBlock.text);
    }
    else {
        console.log("Result:", JSON.stringify(result, null, 2));
    }
    await transport.close();
    console.log("\nDone.");
}
main().catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
});

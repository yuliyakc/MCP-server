const path = require("path");

const serverIndex = path.join(__dirname, "node_modules", "@modelcontextprotocol", "sdk", "dist", "server", "index.js");
const serverStdio = path.join(__dirname, "node_modules", "@modelcontextprotocol", "sdk", "dist", "server", "stdio.js");

const { Server } = require(serverIndex);
const { StdioServerTransport } = require(serverStdio);

const { chromium } = require("playwright");

console.log("SERVER: starting...");

let browser;
let page;

async function startBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();
  }
}

const server = new Server(
  { name: "playwright-mcp", version: "1.0.0" },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1) Важно: убери весь блок server.setRequestHandler("tools/open"...)
// и замени на один handler ниже:

// --- schemas (для SDK 0.6.0) ---
const typesPath = path.join(__dirname, "node_modules", "@modelcontextprotocol", "sdk", "dist", "types.js");
const types = require(typesPath);

// пробуем несколько вариантов имён (на разных сборках названия чуть отличаются)
const ListToolsRequestSchema =
  types.ListToolsRequestSchema ||
  types.ToolsListRequestSchema ||
  types.ListToolsSchema;

const CallToolRequestSchema =
  types.CallToolRequestSchema ||
  types.ToolsCallRequestSchema ||
  types.CallToolSchema;

if (!ListToolsRequestSchema || !CallToolRequestSchema) {
  console.log("Не нашла схемы. Доступные exports из types.js:\n", Object.keys(types));
  throw new Error("Нужны схемы ListToolsRequestSchema и CallToolRequestSchema (или аналоги).");
}

// --- tools/list ---
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "open",
        description: "Open website",
        inputSchema: {
          type: "object",
          properties: { url: { type: "string" } },
          required: ["url"],
        },
      },
      {
        name: "click",
        description: "Click element",
        inputSchema: {
          type: "object",
          properties: { selector: { type: "string" } },
          required: ["selector"],
        },
      },
      {
        name: "fill",
        description: "Type text",
        inputSchema: {
          type: "object",
          properties: { selector: { type: "string" }, text: { type: "string" } },
          required: ["selector", "text"],
        },
      },
      {
        name: "wait",
        description: "Wait",
        inputSchema: {
          type: "object",
          properties: { ms: { type: "number" } },
          required: ["ms"],
        },
      },
    ],
  };
});

// --- tools/call ---
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  await startBrowser();

  if (name === "open") {
    await page.goto(args.url);
    return { content: [{ type: "text", text: "Opened site" }] };
  }
  if (name === "click") {
    await page.click(args.selector);
    return { content: [{ type: "text", text: "Clicked" }] };
  }
  if (name === "fill") {
    await page.fill(args.selector, args.text);
    return { content: [{ type: "text", text: "Text entered" }] };
  }
  if (name === "wait") {
    await page.waitForTimeout(args.ms);
    return { content: [{ type: "text", text: "Waited" }] };
  }

  throw new Error(`Unknown tool: ${name}`);
});

(async () => {
  console.log("SERVER: connecting...");
  await server.connect(new StdioServerTransport());
  console.log("SERVER: connected, waiting...");
})();

process.stdin.resume();
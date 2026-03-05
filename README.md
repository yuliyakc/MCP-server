Overview

This project demonstrates how to connect Claude to a browser using a Playwright MCP server.
System architecture:
Human → Claude → MCP Server → Playwright → Browser
Roles in the system:
Claude – the brain that decides what actions to perform.
Playwright – the hands that control the browser.
MCP server – the control interface that allows Claude to send commands to Playwright.

Requirements: 
Node.js 18+ (recommended: at most 20) - https://nodejs.org/
A code editor (recommended: Visual Studio Code) - https://code.visualstudio.com/
A Claude subscription with PRO access - desktop version
A Claude chrome extension https://chromewebstore.google.com/publisher/anthropic/u308d63ea0533efcf7ba778ad42da7390
Playwright


1. Create the Project

Open VS Code
Create a new folder:

mcp-playwright

Inside the folder create a file:

server.js - MCP Server Code

2. Install Dependencies

Open the terminal in VS Code and run:

cd path/to/mcp-playwright - path to mcp-playwright folder
npm install @modelcontextprotocol/sdk playwright
npx playwright install

3. Start the MCP Server

Run the server:

node server.js

Important:

Keep the terminal open

The MCP server must remain running while Claude uses it.

4. Prepare Claude

Install Claude https://claude.ai/download (official desktop version NOT Microsoft Store) OR PowerShell winget install Anthropic.Claude

Check directory: %APPDATA%\Claude

Put this file into directory: claude_desktop_config.json
{
  "mcpServers": {
    "playwright-mcp": {
      "command": "node",
      "args": ["C:\\Users\\Public\\mcp-playwright\\server.js"]
    }
  }
}

Close Claude and open again
Install Claude chrome extension and open it inside the browser

5. Test MSP Server

Test 1

Start server server.js (don't close)
Open Claude desktop
Open Claude extention
Add to Claude: What MCP tools do you have?
Expected result (roughly): 

I have these tools:
open
click
fill
wait

Test 2
Start server server.js (don't close)
Open Claude desktop
Open Claude extention
Add to Claude: open https://epson-gb.cbnd-seikoepso3-s2-public.model-t.cc.commerce.ondemand.com/en_GB 
Allow the access to this site in the modal window
Add to Claude: perform an exploratory testing 


# Browser Automation Setup (Claude + Browser Use Cloud + Playwright MCP)

This guide explains how to set up **Claude Desktop with MCP servers** for browser automation and testing using:

* **Browser Use Cloud MCP**
* **Playwright MCP**
* **Claude Desktop**

This setup allows you to run AI-driven browser automation and testing workflows.

---

# Architecture

The system works like this:

Claude Desktop
│
├── Playwright MCP (local browser automation)
└── Browser Use Cloud MCP (AI browser agent in the cloud)

Additionally, you may have:

Claude Chrome Extension → direct interaction with your local Chrome browser.

---

# Prerequisites

Install the following:

* **Node.js (>=18)**
* **Claude Desktop**
* **npm**

Verify installation:

```
node -v
npm -v
```

---

# 1. Install MCP Remote (required for Browser Use Cloud)

Browser Use Cloud requires the `mcp-remote` proxy.

Install globally:

```
npm install -g mcp-remote
```

Verify installation:

```
mcp-remote --help
```

If Windows cannot find it, locate it here:

```
C:\Users\<USER>\AppData\Roaming\npm\mcp-remote.cmd
```

---

# 2. Get Browser Use API Key

Create an API key from:

https://browser-use.com

Example:

```
bu_xxxxxxxxxxxxxxxxxxxxx
```

---

# 3. Configure Claude Desktop MCP

Open:

```
C:\Users\<USER>\AppData\Roaming\Claude\claude_desktop_config.json
```

Add the MCP servers configuration:

```
{
  "mcpServers": {
    "playwright-mcp": {
      "command": "node",
      "args": [
        "C:\\Users\\Public\\mcp-playwright\\server.js"
      ]
    },
    "browser-use-cloud": {
      "command": "C:\\Users\\<USER>\\AppData\\Roaming\\npm\\mcp-remote.cmd",
      "args": [
        "https://api.browser-use.com/mcp",
        "--header=X-Browser-Use-API-Key:YOUR_API_KEY"
      ]
    }
  },
  "preferences": {
    "coworkWebSearchEnabled": true,
    "sidebarMode": "chat",
    "coworkScheduledTasksEnabled": false
  }
}
```

Replace:

```
YOUR_API_KEY
```

with your Browser Use API key.

---

# 4. Restart Claude Desktop

After saving the config:

1. Close Claude Desktop completely.
2. Ensure no Claude process is running.
3. Start Claude Desktop again.

---

# 5. Verify MCP Tools

Ask Claude:

```
What MCP tools are available?
```

Expected result:

Browser Use Cloud:

```
browser_task
execute_skill
get_cookies
list_browser_profiles
list_skills
monitor_task
```

Playwright MCP:

```
open
click
fill
wait
```

---

# 6. How to Run Browser Use Tasks

Example prompt:

```
Create a browser_task to test login on https://example.com
```

Claude will execute the task using:

```
browser-use-cloud
```

---

# 7. Playwright MCP Usage

Example:

```
Use Playwright MCP tools.

1. open https://example.com
2. click login
3. fill email field with test@test.com
4. fill password with 123456
5. click submit
6. wait for dashboard
```

This triggers:

```
open
click
fill
wait
```

---

# 8. How to Identify Which MCP Is Used

| Tool Name              | MCP Server              |
| ---------------------- | ----------------------- |
| browser_task           | Browser Use Cloud       |
| monitor_task           | Browser Use Cloud       |
| open/click/fill/wait   | Playwright MCP          |
| computer/find/navigate | Claude Chrome Extension |

---

# 9. Recommended Testing Workflow

Typical QA workflow:

1. Browser Use Cloud explores the site and discovers flows.
2. Claude generates Playwright test scenarios.
3. Playwright MCP executes stable regression tests.

Example workflow:

```
Browser Use → discover flows
Claude → generate Playwright tests
Playwright → run regression
```

---

# 10. Security Note

If an API key becomes exposed:

1. Revoke the key in Browser Use dashboard.
2. Generate a new one.
3. Update the Claude configuration file.

---

# Result

You now have an AI-powered browser testing stack:

Claude Desktop

* Browser Use Cloud
* Playwright MCP

This setup enables:

* AI website exploration
* automated UI testing
* regression testing
* Playwright test generation

---
IMPORTANT: If the MCP proxy does not start automatically, run the following command in PowerShell before launching Claude:

mcp-remote https://api.browser-use.com/mcp --header="X-Browser-Use-API-Key:YOUR_API_KEY"

Actual MCP
{
  "mcpServers": {
    "playwright-mcp": {
      "command": "node",
      "args": [
        "C:\\Users\\Public\\mcp-playwright\\server.js"
      ]
    }
  },
  "preferences": {
    "coworkWebSearchEnabled": true,
    "sidebarMode": "chat",
    "coworkScheduledTasksEnabled": false
  }
}

Guide - browser use

1. Install Python

Install Python 3.11+
Verify:
python --version

2. Install uv (Python package manager)
pip install uv
Verify:
uv --version

3. Clone the browser-use repository
git clone https://github.com/browser-use/browser-use
cd browser-use

4. Install dependencies
uv sync --all-extras --dev
This installs:
Playwright
AI dependencies
browser automation stack

5. Install the browser
uvx browser-use install
This installs Chromium for automation.

6. Create environment file
Create:
.env
Add your API key:
BROWSER_USE_API_KEY=your_key_here
You can get a key from:
https://cloud.browser-use.com
Running browser-use locally
Test browser automation:

uv run examples/simple.py

If successful:
Chromium opens
The AI agent performs a task.

Open Claude config:

C:\Users\<USER>\AppData\Roaming\Claude\claude_desktop_config.json

Example configuration:

{
  "mcpServers": {
    "playwright-mcp": {
      "command": "npx",
      "args": [
        "@playwright/mcp"
      ]
    },
    "browser-use": {
      "command": "C:\\Users\\Lenovo\\AppData\\Local\\Programs\\Python\\Python312\\Scripts\\uvx.exe",
      "args": [
        "browser-use",
        "--mcp"
      ],
      "cwd": "C:\\Users\\Public\\browser-use\\browser-use",
      "env": {
        "BROWSER_USE_API_KEY": "YOUR KEY"
      }
    }
  },
  "preferences": {
    "coworkWebSearchEnabled": true,
    "sidebarMode": "chat",
    "coworkScheduledTasksEnabled": false
  }
}

Verify MCP Servers

Open:

Settings → Developer → Local MCP Servers

Expected:

browser-use    running
playwright-mcp running
Testing browser-use

Example prompt:

Use browser-use to search Google for "OpenAI" and tell me the first result.
Debugging

If MCP fails:

Check logs in Claude:

Settings → Developer → View Logs

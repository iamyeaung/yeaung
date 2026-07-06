# Model Context Protocol (MCP) Setup

This project uses the Model Context Protocol (MCP) to provide AI agents with extended capabilities. The MCP configuration defines which servers the AI can spin up to access local systems, external APIs, and custom tools.

## 1. Configuration File

The configuration is managed in the `.mcp.json` file located at the root of the repository.

### Current Servers configured in `.mcp.json`:

#### 1. `filesystem`
- **Command:** `npx @anthropic/mcp-server-filesystem`
- **Purpose:** Allows the agent to read and write files explicitly permitted within a specific directory.
- **Args:** Currently restricted to `/mnt/c/Users/khuny/Desktop/Code/DevPulse` (modify this path if the workspace environment changes).

#### 2. `brave-search`
- **Command:** `npx @anthropic/mcp-server-brave-search`
- **Purpose:** Provides the agent with web search capabilities to look up modern Next.js/Supabase documentation, resolve errors, and gather external context.
- **Environment Variables required:**
  - `BRAVE_API_KEY`: Must be supplied in the environment running the agent.

## 2. Setting Up Environment for MCP

To ensure the MCP servers can start correctly:
1. Ensure `npx` is available in your PATH (Node.js is installed).
2. Export the necessary API keys in your terminal session before launching the agent.
   ```bash
   export BRAVE_API_KEY="your_brave_api_key_here"
   ```
   *(For Windows PowerShell)*
   ```powershell
   $env:BRAVE_API_KEY="your_brave_api_key_here"
   ```

## 3. Agent Guidelines
- AI agents should verify that `.mcp.json` is present and well-formed.
- If a web search is needed (e.g., to fetch Next.js App Router specific documentation), the agent can invoke the `brave-search` tool.
- Do not modify `.mcp.json` unless explicitly requested by the user to add a new server or update allowed filesystem paths.

# Monad MCP Server

A Model Context Protocol (MCP) server that connects AI assistants (like Claude) to the Monad blockchain testnet.

## What This Project Does

This MCP server enables Claude Desktop users to interact with the Monad blockchain using natural language prompts. The server provides four blockchain query tools:

- **get-mon-balance**: Check MON token balance for any address
- **get-block-info**: Retrieve information about blocks (latest or specific number)
- **get-transaction**: View details of transactions by hash
- **get-gas-price**: Get current gas prices on the Monad testnet

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Claude Desktop

## Quick Start

```shell
# Clone this repository
git clone https://github.com/monad-developers/monad-mcp-tutorial.git

# Install dependencies
npm install

# Build the project
npm run build

```

## Setup with Claude Desktop
1. Open Claude Desktop > Settings > Developer
2. Open claude_desktop_config.json
3. Add the MCP server configuration:
```json
{
  "mcpServers": {
    "monad-mcp": {
      "command": "node",
      "args": [
        "<absolute-path-to-project>/build/index.js"
      ]
    }
  }
}
```
4. Restart Claude Desktop
5. Start interacting with Monad blockchain through Claude!

## Example Prompts

. "What's the MON balance of 0x742d35Cc6634C0532925a3b844Bc454e4438f44e?"
. "Show me information about the latest block"
. "Get details for transaction 0x123..."
. "What's the current gas price on Monad testnet?"

## Learn more
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/introduction)
- [Monad Documentation](https://docs.monad.xyz/)
- [Viem Documentation](https://viem.sh/)

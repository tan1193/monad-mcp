/**
 * Monad MCP Tutorial
 * 
 * This file demonstrates how to create a Model Context Protocol (MCP) server
 * that interacts with the Monad blockchain testnet to check MON balances.
 */

// Import necessary dependencies
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createPublicClient, formatUnits, http } from "viem";
import { monadTestnet } from "viem/chains";

// Create a public client to interact with the Monad testnet
const publicClient = createPublicClient({
    chain: monadTestnet,
    transport: http(),
});

// Initialize the MCP server with a name, version, and capabilities


// Define a tool that gets the MON balance for a given address

const server = new McpServer({
    name: "monad-testnet",
    version: "0.0.2",
    capabilities: [
        "get-mon-balance", 
        "get-block-info", 
        "get-transaction", 
        "get-gas-price"
    ]
});
// Define a tool that gets the MON balance for a given address
server.tool(
    "get-mon-balance",
    "Get MON balance for an address on Monad testnet",
    {
        address: z.string().describe("Monad testnet address to check balance for"),
    },
    async ({ address }) => {
        try {
            const balance = await publicClient.getBalance({
                address: address as `0x${string}`,
            });

            return {
                content: [
                    {
                        type: "text",
                        text: `Balance for ${address}: ${formatUnits(balance, 18)} MON`,
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to retrieve balance for address: ${address}. Error: ${error instanceof Error ? error.message : String(error)
                            }`,
                    },
                ],
            };
        }
    }
);

// Define a tool to fetch block information
server.tool(
    "get-block-info",
    "Get information about a specific block or the latest block",
    {
        blockNumber: z.number().optional().describe("Block number to query. If not provided, will return the latest block"),
    },
    async ({ blockNumber }) => {
        try {
            const blockInfo = blockNumber 
                ? await publicClient.getBlock({ blockNumber: BigInt(blockNumber) })
                : await publicClient.getBlock();

            return {
                content: [
                    {
                        type: "text",
                        text: `Block #${blockInfo.number}:
- Hash: ${blockInfo.hash}
- Timestamp: ${new Date(Number(blockInfo.timestamp) * 1000).toISOString()}
- Gas Used: ${blockInfo.gasUsed}
- Gas Limit: ${blockInfo.gasLimit}
- Base Fee Per Gas: ${blockInfo.baseFeePerGas ? formatUnits(blockInfo.baseFeePerGas, 9) + " gwei" : "N/A"}
- Transaction Count: ${blockInfo.transactions.length}`,
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to retrieve block info${blockNumber ? ` for block #${blockNumber}` : ''}. Error: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    }
);

// Define a tool to fetch transaction details
server.tool(
    "get-transaction",
    "Get details of a specific transaction by hash",
    {
        txHash: z.string().describe("Transaction hash to query"),
    },
    async ({ txHash }) => {
        try {
            const txInfo = await publicClient.getTransaction({
                hash: txHash as `0x${string}`,
            });

            return {
                content: [
                    {
                        type: "text",
                        text: `Transaction ${txHash}:
- From: ${txInfo.from}
- To: ${txInfo.to || "Contract creation"}
- Value: ${formatUnits(txInfo.value || BigInt(0), 18)} MON
- Gas Price: ${txInfo.gasPrice ? formatUnits(txInfo.gasPrice, 9) + " gwei" : "N/A"}
- Gas Limit: ${txInfo.gas}
- Nonce: ${txInfo.nonce}`,
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to retrieve transaction info for ${txHash}. Error: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    }
);

// Define a tool to get current gas prices
server.tool(
    "get-gas-price",
    "Get current gas price on Monad testnet",
    {},
    async () => {
        try {
            const gasPrice = await publicClient.getGasPrice();
            const formattedPrice = formatUnits(gasPrice, 9); // Convert to gwei

            return {
                content: [
                    {
                        type: "text",
                        text: `Current gas price on Monad testnet: ${formattedPrice} gwei`,
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to retrieve current gas price. Error: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    }
);

/**
* Main function to start the MCP server
* Uses stdio for communication with LLM clients
*/
async function main() {
    // Create a transport layer using standard input/output
    const transport = new StdioServerTransport();

    // Connect the server to the transport
    await server.connect(transport);

    console.error("Monad testnet MCP Server running on stdio");
}

// Start the server and handle any fatal errors
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});

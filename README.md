# Tron indexer based on SQD EvmBatchProcessor

This simple [squid](https://docs.sqd.dev/sdk/overview/) uses the EVM-compatible subset of the Tron JSON API to get the following data off the Tron network:

1. USDT `Transfer(address,address,uint256)` events
2. Transactions that burn TRX

The data is ingested from a Tron JSON RPC endpoint using [`.addLog()`](https://docs.sqd.dev/evm-indexing/configuration/evm-logs/) and [`.addTransaction()`](https://docs.sqd.dev/evm-indexing/configuration/transactions/) methods of `EvmBatchProcessor`. Data fields are chosen with [`.setFields()`](https://docs.sqd.dev/evm-indexing/configuration/data-selection/).

The requested data is transformed in batches by a single handler provided to the `processor.run()` method. The final data is presented as a GraphQL API.

Dependencies: Node.js v20 or newer, Git, Docker.

## Quickstart

```bash
# 1. Retrieve the example
git clone https://github.com/subsquid-labs/squid-tron-evm-example
cd squid-tron-evm-example

# 2. Install dependencies
npm ci

# 3. Start a Postgres database container and detach
docker compose up -d

# 4. Build the squid
npm run build

# 5. Start both the squid processor and the GraphQL server
sqd run .
```
A GraphiQL playground will be available at [localhost:4350/graphql](http://localhost:4350/graphql).

You can also start squid services one by one:
```bash
node -r dotenv/config lib/main.js # starts the processor
```
```bash
npx squid-graphql-server
```

See the [master dev guide](https://docs.sqd.dev/sdk/how-to-start/squid-development/) to learn where to go from here.

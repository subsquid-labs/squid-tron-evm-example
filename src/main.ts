import {EvmBatchProcessor} from '@subsquid/evm-processor'
import {TypeormDatabase} from '@subsquid/typeorm-store'
import {assertNotNull} from '@subsquid/util-internal'
import * as tronFormatAddress from 'tron-format-address'
import {UsdtTransfer, TrxBurn} from './model'
import * as erc20 from './abi/erc20'

export const USDT_ADDRESS = tronFormatAddress.toHex('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t')

export const processor = new EvmBatchProcessor()
    // No dataset/gateway is available at the moment (2024/09/13),
    // so please use a JSON RPC. Use a private one in prod.
    // Http(s) and ws(s) endpoints are supported.
    .setRpcEndpoint({
        url: assertNotNull(process.env.RPC_TRON_JSON, 'Please supply a JSON RPC endpoint'),
        rateLimit: 10
    })
    // Tron achieves finality in 19 blocks, roughly doubling that
    // https://chainspect.app/chain/tron
    .setFinalityConfirmation(40)
    // On Tron, the only data requesting methods are the EVM-compatible ones:
    //  - addTransaction(): see https://docs.sqd.dev/sdk/reference/processors/evm-batch/transactions/
    //  - addLog(): see https://docs.sqd.dev/sdk/reference/processors/evm-batch/logs/
    .addLog({
        address: [ USDT_ADDRESS ],
        topic0: [ erc20.events.Transfer.topic ],
    })
    .addTransaction({
        to: [
            // Destruction addresses in hex format
            '0x0000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000001',
            '0x0000000000000000000000000000000000000002',
        ],
    })
    // See https://docs.sqd.dev/sdk/reference/processors/evm-batch/field-selection/
    .setFields({
        block: {
            timestamp: true,
        },
        log: {
            transactionHash: true,
        },
        transaction: {
            from: true,
            value: true,
            hash: true,
        },
    })
    .setBlockRange({
        from: 65190000,
    })


                                                                                
// The code below is a very basic PoC that just saves the decoded data to the
// database, see
// https://docs.sqd.dev/sdk/how-to-start/squid-development/ for dev guidance
processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    const usdtTransfers: UsdtTransfer[] = []
    const trxBurns: TrxBurn[] = []

    for (let block of ctx.blocks) {
        const timestamp = BigInt(assertNotNull(
            block.header.timestamp,
            `Block ${block.header.height} has no timestamp, exiting`
        ))
        for (let log of block.logs) {
            const { from, to, value } = erc20.events.Transfer.decode(log)
            const tronFrom = tronFormatAddress.fromHex(from)
            const tronTo = tronFormatAddress.fromHex(to)
            usdtTransfers.push(
                new UsdtTransfer({
                    id: log.id,
                    block: block.header.height,
                    timestamp,
                    from: tronFrom,
                    to: tronTo,
                    value,
                    txHash: log.transactionHash,
                })
            )
        }
        for (let tx of block.transactions) {
            trxBurns.push(
                new TrxBurn({
                    id: tx.id,
                    block: block.header.height,
                    timestamp,
                    address: tx.from,
                    value: tx.value,
                    txHash: tx.hash,
                })
            )
        }
    }


    const usdtTransferred = usdtTransfers.reduce((acc, b) => acc + b.value, 0n) / 1_000_000n
    const trxBurned = trxBurns.reduce((acc, b) => acc + b.value, 0n) / 1_000_000n
    const startBlock = ctx.blocks.at(0)?.header.height
    const endBlock = ctx.blocks.at(-1)?.header.height
    ctx.log.info(`Tron transferred ${usdtTransferred} USDT and burned ${trxBurned} TRX from ${startBlock} to ${endBlock}`)

    // upsert batches of entities with batch-optimized ctx.store.insert()/upsert()
    await ctx.store.insert(usdtTransfers)
    await ctx.store.insert(trxBurns)
})

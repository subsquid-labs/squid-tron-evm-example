import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class UsdtTransfer {
    constructor(props?: Partial<UsdtTransfer>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    block!: number

    @Index_()
    @BigIntColumn_({nullable: false})
    timestamp!: bigint

    @Index_()
    @StringColumn_({nullable: false})
    from!: string

    @Index_()
    @StringColumn_({nullable: false})
    to!: string

    @BigIntColumn_({nullable: false})
    value!: bigint

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string
}

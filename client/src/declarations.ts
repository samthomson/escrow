export type Address = string
export type EscrowAgreement = {
	initiator: {
		initiatorAddress: Address
		currency: Address
		suppliedAmount: number
	}
	counterparty: {
		currency: Address
		requiredAmount: number
	}
	isFilled: boolean
	isCancelled: boolean
}

export type Token = {
	name: string
	address: Address
	decimals: number
}

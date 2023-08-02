type address = string
export type EscrowAgreement = {
	initiator: {
		initiatorAddress: address
		currency: address
		suppliedAmount: number
	}
	counterparty: {
		currency: address
		requiredAmount: number
	}
	isFilled: boolean
}
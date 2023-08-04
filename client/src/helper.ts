import * as Types from './declarations'

export const tokens: Types.Token[] = [
	{
		name: "TeTo",
		address: '0x36e6040b4186F9f0Ad9b3c25a9C1c9EE58112D0a',
		decimals: 18
	},
	{
		name: "ReToke",
		address: '0x540053115bA579EB32aCddfaFe2d121340553411',
		decimals: 18
	},
]

export const tokenFromAddress = (address: Types.Address): Types.Token | undefined => {
	return tokens.find(token => token.address === address)
}

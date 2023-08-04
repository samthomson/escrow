import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core'

// escrow contract 0x
const contractAddress = '0x5E53089d723e0A29c6385cc99528e8bAFBEA04EB';
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "agreementId",
				"type": "uint256"
			}
		],
		"name": "AgreementCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "agreementId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "initiatorAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "initiatorCurrency",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "initiatorSuppliedAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "counterpartyCurrency",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "counterpartyRequiredAmount",
				"type": "uint256"
			}
		],
		"name": "AgreementCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "agreementId",
				"type": "uint256"
			}
		],
		"name": "AgreementFilled",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "agreementCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "agreements",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "initiatorAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "currency",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "suppliedAmount",
						"type": "uint256"
					}
				],
				"internalType": "struct Escrow.Initiator",
				"name": "initiator",
				"type": "tuple"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "currency",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "requiredAmount",
						"type": "uint256"
					}
				],
				"internalType": "struct Escrow.Counterparty",
				"name": "counterparty",
				"type": "tuple"
			},
			{
				"internalType": "bool",
				"name": "isFilled",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isCancelled",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "initiatorCurrency",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "initiatorSuppliedAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "counterPartyCurrency",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "counterPartyRequiredAmount",
				"type": "uint256"
			}
		],
		"name": "createAgreement",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function",
		"payable": true
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "agreementId",
				"type": "uint256"
			}
		],
		"name": "cancelAgreement",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "agreementId",
				"type": "uint256"
			}
		],
		"name": "fillAgreement",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function",
		"payable": true
	}
] as const

export const useContract = () => {

	const [escrowContract, setEscrowContract] = useState<ethers.Contract | null>(null);

	const { library, account } = useWeb3React();

	useEffect(() => {
		if (library && account) {
			const contractInstance = new ethers.Contract(contractAddress, contractABI, library.getSigner())
			setEscrowContract(contractInstance);
		}

	}, [library, account]);

	return { escrowContract };
};

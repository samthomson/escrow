import React from 'react';
import { Contract, ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core'

import * as Types from '../declarations'
import EscrowAgreement from './EscrowAgreement'
import AgreementForm from './AgreementForm';

export const ERC20ABI = [
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [{ "name": "", "type": "string" }],
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [{ "name": "", "type": "uint256" }],
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [{ "name": "", "type": "uint8" }],
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [{ "name": "_owner", "type": "address" }],
		"name": "balanceOf",
		"outputs": [{ "name": "balance", "type": "uint256" }],
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{ "name": "_to", "type": "address" },
			{ "name": "_value", "type": "uint256" }
		],
		"name": "transfer",
		"outputs": [],
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{ "name": "_spender", "type": "address" },
			{ "name": "_value", "type": "uint256" }
		],
		"name": "approve",
		"outputs": [],
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{ "name": "_owner", "type": "address" },
			{ "name": "_spender", "type": "address" }
		],
		"name": "allowance",
		"outputs": [{ "name": "", "type": "uint256" }],
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{ "name": "_from", "type": "address" },
			{ "name": "_to", "type": "address" },
			{ "name": "_value", "type": "uint256" }
		],
		"name": "transferFrom",
		"outputs": [],
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [{ "name": "", "type": "address" }],
		"name": "balances",
		"outputs": [{ "name": "", "type": "uint256" }],
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [{ "name": "", "type": "string" }],
		"type": "function"
	},
	{
		"inputs": [],
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "name": "from", "type": "address" },
			{ "indexed": true, "name": "to", "type": "address" },
			{ "indexed": false, "name": "value", "type": "uint256" }
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "name": "owner", "type": "address" },
			{ "indexed": true, "name": "spender", "type": "address" },
			{ "indexed": false, "name": "value", "type": "uint256" }
		],
		"name": "Approval",
		"type": "event"
	}
] as const

export const tokens: Types.Token[] = [
	{
		name: "TeTo",
		address: '0x36e6040b4186F9f0Ad9b3c25a9C1c9EE58112D0a',
		decimals: 18
	},
	{
		name: "ReToke",
		address: '0x131335C9e4B6df8966F221F83c088dDC816967bd',
		decimals: 18
	},
]

const EscrowContractInteraction: React.FC = () => {
	const [agreementsCount, setAgreementsCount] = React.useState<number | undefined>(undefined);

	const [agreements, setAgreements] = React.useState<Types.EscrowAgreement[]>([])

	const { library, account } = useWeb3React();

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


	// escrow contract 0x
	const contractAddress = '0x5E53089d723e0A29c6385cc99528e8bAFBEA04EB';

	const escrowContractRef = React.useRef<ethers.Contract | undefined>();



	const fetchAgreements = React.useCallback(async () => {
		// @ts-ignore
		const agreementsCounter = Number(await escrowContractRef.current.agreementCounter());

		console.log('got a count of agreements:', agreementsCounter)

		setAgreementsCount(agreementsCounter)

		const agreements: Types.EscrowAgreement[] = [];
		// setAgreements(agreements)
		for (let i = 0; i < agreementsCounter; i++) {
			// @ts-ignore
			const agreement = await escrowContractRef.current.agreements(i);
			agreements.push(agreement);
			console.log(`fetched agreement ${i}`, agreement)
		}
		setAgreements(agreements)
		// return agreements;
	}, [escrowContractRef.current])


	// Call this function when your component is mounted
	const subscribeToEvents = () => {
		// Replace 'AgreementCreated' with your actual event name
		escrowContractRef.current?.on("AgreementCreated", () => {
			console.log("AGREEMENT CREATED")
			fetchAgreements();
		});
	};

	// Remember to also unsubscribe when the component is unmounted
	const unsubscribeFromEvents = () => {
		escrowContractRef.current?.off("AgreementCreated");
	};

	React.useEffect(() => {
		if (library && account) {
			escrowContractRef.current = new ethers.Contract(contractAddress, contractABI, library.getSigner());
			fetchAgreements()
			subscribeToEvents()
		}

		return () => {
			unsubscribeFromEvents()
		}
	}, [library, account])


	const isConnected = !!account;


	return (
		<div className='container'>
			<h1>Aggreements: {agreementsCount}</h1>
			<div id="agreements">
				{agreements.map((agreement, key) => <div key={key}>
					{/* {key}<br/> */}
					<EscrowAgreement id={key} agreement={agreement} myAddress={account as Types.Address} escrowContract={escrowContractRef.current as Contract} />
				</div>)}
			</div>
			{/* <hr /> */}
			<br />
			{
				isConnected && <>
					<AgreementForm escrowContract={escrowContractRef.current as Contract} />
				</>
			}
		</div>
	);
};

export default EscrowContractInteraction;

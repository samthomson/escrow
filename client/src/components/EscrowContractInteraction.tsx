import React from 'react';
import { useWeb3React } from '@web3-react/core'

import * as Types from '../declarations'
import EscrowAgreement from './EscrowAgreement'
import AgreementForm from './AgreementForm';
import { useContract } from '../hooks/useEscrowContract';

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

const EscrowContractInteraction: React.FC = () => {
	const [agreementsCount, setAgreementsCount] = React.useState<number | undefined>(undefined);

	const [agreements, setAgreements] = React.useState<Types.EscrowAgreement[]>([])

	const { account } = useWeb3React();
	const { escrowContract } = useContract()

	const fetchAgreements = React.useCallback(async () => {
		if (!escrowContract) {
			console.error('contract not around')
			return
		}
		// @ts-ignore
		const agreementsCounter = Number(await escrowContract.agreementCounter());

		console.log('got a count of agreements:', agreementsCounter)

		setAgreementsCount(agreementsCounter)

		const agreements: Types.EscrowAgreement[] = [];
		// setAgreements(agreements)
		for (let i = 0; i < agreementsCounter; i++) {
			// @ts-ignore
			const agreement = await escrowContract.agreements(i);
			agreements.push(agreement);
			console.log(`fetched agreement ${i}`, agreement)
		}
		setAgreements(agreements)
		// return agreements;
	}, [escrowContract])


	// Call this function when your component is mounted
	const subscribeToEvents = () => {
		// reload agreements when we get a relevant event from the contract
		escrowContract?.on("AgreementCreated", () => {
			console.log("AGREEMENT CREATED - refetch agreements")
			fetchAgreements();
		});
		escrowContract?.on("AgreementCancelled", () => {
			console.log("AGREEMENT CANCELLED - refetch agreements")
			fetchAgreements();
		});
		escrowContract?.on("AgreementFilled", () => {
			console.log("AGREEMENT FILLED - refetch agreements")
			fetchAgreements();
		});
	};

	// Remember to also unsubscribe when the component is unmounted
	const unsubscribeFromEvents = () => {
		escrowContract?.off("AgreementCreated");
		escrowContract?.off("AgreementCancelled");
		escrowContract?.off("AgreementFilled");
	};

	React.useEffect(() => {
		if (escrowContract) {
			fetchAgreements()
			subscribeToEvents()
		}

		return () => {
			unsubscribeFromEvents()
		}
	}, [escrowContract])


	const isConnected = !!account;


	return (
		<div className='container'>
			<h1>Aggreements: {agreementsCount}</h1>
			<div id="agreements">
				{agreements.map((agreement, key) => <div key={key}>
					{/* {key}<br/> */}
					<EscrowAgreement id={key} agreement={agreement} myAddress={account as Types.Address} />
				</div>)}
			</div>
			{/* <hr /> */}
			<br />
			{
				isConnected && <>
					<AgreementForm />
				</>
			}
		</div>
	);
};

export default EscrowContractInteraction;

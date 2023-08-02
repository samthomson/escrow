import React from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core'

import * as Types from '../declarations'
import EscrowAgreement from './EscrowAgreement'

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
		}
	] as const


	const contractAddress = '0xf7e5B5AAD65e55bde19F678ee305Ec1c0dfa2B7E';

	const escrowContract = new ethers.Contract(contractAddress, contractABI, library.getSigner());

	

	const fetchAgreements = React.useCallback(async () => {
		// @ts-ignore
		const agreementsCounter = Number(await escrowContract.agreementCounter());
		
		setAgreementsCount(agreementsCounter)

		const agreements: Types.EscrowAgreement[] = [];
		setAgreements(agreements)
		for (let i = 0; i < agreementsCounter; i++) {
			// @ts-ignore
			const agreement = await escrowContract.agreements(i);
			agreements.push(agreement);
		}
		setAgreements(agreements)
		return agreements;
	},[])



	React.useEffect(() => {
		if (library && account) {
			fetchAgreements()
		}
	}, [library, account, fetchAgreements])


	const isConnected = !!account;

	const onSubmitAggreement = async (event: { preventDefault: () => void; }) => {
		event.preventDefault();
		
        const initiatorCurrency = '0x36e6040b4186F9f0Ad9b3c25a9C1c9EE58112D0a'
        const initiatorSuppliedAmount = ethers.parseEther("1")
        const counterPartyCurrency = '0x540053115bA579EB32aCddfaFe2d121340553411'
        const counterPartyRequiredAmount = ethers.parseEther("1000")

		await escrowContract.createAgreement(
			initiatorCurrency,
         	initiatorSuppliedAmount,
			counterPartyCurrency,
			counterPartyRequiredAmount,
			{ value: ethers.parseEther("1")}
		);
	}

	return (
		<div>
			<h1>Aggreements: {agreementsCount}</h1>
			{agreements.map((agreement, key) => <div key={key}>
				<EscrowAgreement agreement={agreement} />
			</div>)}
			<hr />
			{
				isConnected && <>
					<form onSubmit={onSubmitAggreement}>
						{/* <input type="text" value={messageInput} onChange={e => setMessageInput(e.currentTarget.value)} /> */}
						<button type="submit">submit agreement</button>
					</form>
				</>
			}
		</div>
	);
};

export default EscrowContractInteraction;

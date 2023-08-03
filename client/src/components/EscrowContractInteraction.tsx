import React from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'

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

	const ERC20ABI = [
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


	// escrow contract 0x
	const contractAddress = '0xC0D9E81c5FB957a7b93058Ae995Ee931d47DC903';

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
	},[escrowContractRef.current])


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

	const onSubmitAggreement = React.useCallback(async (event: { preventDefault: () => void; }) => {
		event.preventDefault();


		const initiatorCurrency = '0x36e6040b4186F9f0Ad9b3c25a9C1c9EE58112D0a'
		const initiatorSuppliedAmount = 1
		const counterPartyCurrency = '0x540053115bA579EB32aCddfaFe2d121340553411'
		const counterPartyRequiredAmount = 1000

	
		try {
			if (!!escrowContractRef.current) {
				// todo: get decimal amount intelligently
				const biInitiatorSuppliedAmount = ethers.parseUnits(`${initiatorSuppliedAmount}`, 18)
				const biCounterPartyRequiredAmount = ethers.parseUnits(`${counterPartyRequiredAmount}`, 18)

				// const bnInitiatorSuppliedAmount = BigNumber.from(ethers.parseEther(`${initiatorSuppliedAmount}`))
				// const bnCounterPartyRequiredAmount = BigNumber.from(ethers.parseEther(`${counterPartyRequiredAmount}`))

	
				// Get the current signer (user's wallet)
				const signer = library.getSigner()
	
				// Create an instance of the ERC20 token contract you want to interact with
				const tokenContract = new ethers.Contract(initiatorCurrency, ERC20ABI, signer)
				// Here `abi` is the ABI of the ERC20 contract (you can import it from a separate file)
	
				// Check the current allowance
				// console.log('contract', escrowContractRef?.current)
				// console.log('contract address', escrowContractRef.current?.address)
				const currentAllowance = BigNumber.from(await tokenContract.allowance(signer.getAddress(), escrowContractRef.current.target))

	
				// Calculate new allowance
				const newAllowance = ethers.formatUnits(currentAllowance.add(biInitiatorSuppliedAmount).toString(), 18);

				const newAllowanceToString = newAllowance.toString()
				const newAllowanceParsed = ethers.parseUnits(newAllowanceToString, 18)

				console.log('approvals', {
					currentAllowance, newAllowance, biInitiatorSuppliedAmount,
					newAllowanceToString,
					newAllowanceParsed
				})

				// Approve the new allowance
				const approveTx = await tokenContract.approve(escrowContractRef.current.target, newAllowanceParsed)


				// Wait for approval to be mined
				// await approveTx.wait()
		
				// Now, when the contract is approved, we can call the createAgreement function
				const receipt = await escrowContractRef.current.createAgreement(
					initiatorCurrency,
					biInitiatorSuppliedAmount,
					counterPartyCurrency,
					biCounterPartyRequiredAmount,
				);
	
				console.log('receipt', receipt);
			}
		} catch (error) {
			console.log('An error occurred: ', error);
		}
	}, [escrowContractRef.current])

	return (
		<div className='container'>
			<h1>Aggreements: {agreementsCount}</h1>
			<div id="agreements">
				{agreements.map((agreement, key) => <div key={key}>
					{/* {key}<br/> */}
					<EscrowAgreement agreement={agreement} myAddress={account as Types.Address} />
				</div>)}
			</div>
			<hr />
			{
				isConnected && <>
					<form onSubmit={onSubmitAggreement}>
						{/* <input type="text" value={messageInput} onChange={e => setMessageInput(e.currentTarget.value)} /> */}
						<button type="submit" className='button'>submit new agreement</button>
					</form>
				</>
			}
		</div>
	);
};

export default EscrowContractInteraction;

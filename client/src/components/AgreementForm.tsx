import React from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'
import { useForm } from '@mantine/form';

import { ERC20ABI } from './EscrowContractInteraction'
import * as HelperUtil from '../helper'
import { useContract } from '../hooks/useEscrowContract';


const AgreementForm: React.FC = () => {

	const { library } = useWeb3React();
	const { escrowContract } = useContract()

	// todo: blank these and let the user select from html control
	const form = useForm({
		initialValues: {
			initiatorCurrency: '',
			initiatorSuppliedAmount: '',
			counterPartyCurrency: '',
			counterPartyRequiredAmount: '',
		},

		validate: {
			initiatorCurrency: (value: string) => value.trim().length === 42, // Simple validation for Ethereum address length
			initiatorSuppliedAmount: (value) => !isNaN(Number(value)) && Number(value) > 0,
			counterPartyCurrency: (value: string, values) => value.trim().length === 42 && value !== values.initiatorCurrency, // Simple validation for Ethereum address length
			counterPartyRequiredAmount: (value) => !isNaN(Number(value)) && Number(value) > 0,
		},
	});


	const onSubmitAggreement = React.useCallback(async (event: { preventDefault: () => void; }) => {
		event.preventDefault();


		const initiatorCurrency = form.values.initiatorCurrency
		const initiatorSuppliedAmount = form.values.initiatorSuppliedAmount
		const counterPartyCurrency = form.values.counterPartyCurrency
		const counterPartyRequiredAmount = form.values.counterPartyRequiredAmount


		const initiatorToken = HelperUtil.tokenFromAddress(initiatorCurrency)
		const counterpartyToken = HelperUtil.tokenFromAddress(counterPartyCurrency)

		if (!initiatorToken || !counterpartyToken) {
			alert('tokens not found, can not proceed without knowing decimals')
			return
		}

		try {
			if (!escrowContract) {
				console.error('contract not around')
				return
			}

			// todo: get decimal amount intelligently
			const biInitiatorSuppliedAmount = ethers.parseUnits(`${initiatorSuppliedAmount}`, initiatorToken.decimals)
			const biCounterPartyRequiredAmount = ethers.parseUnits(`${counterPartyRequiredAmount}`, counterpartyToken.decimals)

			// const bnInitiatorSuppliedAmount = BigNumber.from(ethers.parseEther(`${initiatorSuppliedAmount}`))
			// const bnCounterPartyRequiredAmount = BigNumber.from(ethers.parseEther(`${counterPartyRequiredAmount}`))


			// Get the current signer (user's wallet)
			const signer = library.getSigner()

			// Create an instance of the ERC20 token contract you want to interact with
			const tokenContract = new ethers.Contract(initiatorCurrency, ERC20ABI, signer)
			// Here `abi` is the ABI of the ERC20 contract (you can import it from a separate file)

			// Check the current allowance
			const currentAllowance = BigNumber.from(await tokenContract.allowance(signer.getAddress(), escrowContract.target))


			// Calculate new allowance
			const newAllowance = ethers.formatUnits(currentAllowance.add(biInitiatorSuppliedAmount).toString(), initiatorToken.decimals);

			const newAllowanceToString = newAllowance.toString()
			const newAllowanceParsed = ethers.parseUnits(newAllowanceToString, initiatorToken.decimals)

			console.log('approvals', {
				currentAllowance, newAllowance, biInitiatorSuppliedAmount,
				newAllowanceToString,
				newAllowanceParsed
			})

			// Approve the new allowance
			const approveTx = await tokenContract.approve(escrowContract.target, newAllowanceParsed)


			// Wait for approval to be mined
			// await approveTx.wait()

			// Now, when the contract is approved, we can call the createAgreement function
			const receipt = await escrowContract.createAgreement(
				initiatorCurrency,
				biInitiatorSuppliedAmount,
				counterPartyCurrency,
				biCounterPartyRequiredAmount,
			);

			console.log('receipt', receipt);
		} catch (error) {
			console.log('An error occurred: ', error);
		}
	}, [escrowContract, form.values])

	return (
		<div className='new-agreement-form'>

			<form onSubmit={onSubmitAggreement} >
				<label htmlFor="initiatorCurrency">Initiator Currency:</label>
				<select
					{...form.getInputProps('initiatorCurrency')}
					id="initiatorCurrency"
					className="your-input-class"
				>
					<option value="">Select token address</option>
					{HelperUtil.tokens.map((token, key) => <option key={key} value={token.address}>{token.address} ({token.name})</option>)}
				</select>

				<label htmlFor="initiatorSuppliedAmount">Initiator Supplied Amount:</label>
				<input
					{...form.getInputProps('initiatorSuppliedAmount')}
					id="initiatorSuppliedAmount"
					className="your-input-class"
					type="number"
					min="1"
					step="any"
					placeholder="enter the amount you'll provide"
				/>

				<label htmlFor="counterPartyCurrency">Counterparty Currency:</label>
				<select
					{...form.getInputProps('counterPartyCurrency')}
					id="counterPartyCurrency"
				>
					<option value="">Select token address</option>
					{HelperUtil.tokens.map((token, key) => <option key={key} value={token.address}>{token.address} ({token.name})</option>)}
				</select>



				<label htmlFor="counterPartyRequiredAmount">Counterparty Required Amount:</label>
				<input
					{...form.getInputProps('counterPartyRequiredAmount')}
					id="counterPartyRequiredAmount"
					className="your-input-class"
					type="number"
					min="1"
					step="any"
					placeholder="enter the amount you want"
				/>

				<button type="submit">Create Agreement</button>
			</form>
		</div>
	);
}

export default AgreementForm;

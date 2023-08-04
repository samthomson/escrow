import React from 'react';
import { ethers, Contract } from 'ethers';
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'

import { ERC20ABI } from './EscrowContractInteraction'

interface AgreementFormProps {
	escrowContract: Contract
}

const AgreementForm: React.FC<AgreementFormProps> = ({ escrowContract }) => {

	const { library } = useWeb3React();

	const onSubmitAggreement = React.useCallback(async (event: { preventDefault: () => void; }) => {
		event.preventDefault();


		const initiatorCurrency = '0x36e6040b4186F9f0Ad9b3c25a9C1c9EE58112D0a'
		const initiatorSuppliedAmount = 1
		const counterPartyCurrency = '0x540053115bA579EB32aCddfaFe2d121340553411'
		const counterPartyRequiredAmount = 2

		try {
			if (!!escrowContract) {
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
				const currentAllowance = BigNumber.from(await tokenContract.allowance(signer.getAddress(), escrowContract.target))


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
			}
		} catch (error) {
			console.log('An error occurred: ', error);
		}
	}, [escrowContract])

	return (
		<>
			<form onSubmit={onSubmitAggreement}>
				{/* <input type="text" value={messageInput} onChange={e => setMessageInput(e.currentTarget.value)} /> */}
				<button type="submit" className='button'>submit new agreement</button>
			</form>
		</>
	);
}

export default AgreementForm;

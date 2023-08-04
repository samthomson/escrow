import React from 'react';
import { ethers, Contract } from 'ethers';
import classNames from 'classnames'
import { useWeb3React } from '@web3-react/core'

import * as Types from '../declarations'
import { ERC20ABI } from './EscrowContractInteraction'

interface EscrowAgreementProps {
	id: number
	agreement: Types.EscrowAgreement
	myAddress: Types.Address
	escrowContract: Contract
}

const EscrowAgreement: React.FC<EscrowAgreementProps> = ({id, agreement, myAddress, escrowContract}) => {

  const { library } = useWeb3React();

	const isMyAgreement = agreement.initiator.initiatorAddress === myAddress
	const { isFilled, initiator, counterparty, isCancelled } = agreement
	const { initiatorAddress, suppliedAmount, currency: initiatorCurrency } = initiator
	const suppliedAmountWhole = ethers.formatUnits(suppliedAmount.toString(), 18)

	const { requiredAmount, currency: counterpartyCurrency } = counterparty
	const requiredAmountWhole = ethers.formatUnits(requiredAmount.toString(), 18)

	const cancelAgreement = async (id: number) => {
		// event.preventDefault();
		// const contract = new ethers.Contract(contractAddress, contractABI, library.getSigner());
		const tx = await escrowContract.cancelAgreement(id);
		console.log(tx)
		// await tx.wait();
	}

	// todo: is wrapping everything in a callback really necessary
	const fillAgreement = React.useCallback(async (agreementId: number) => {

		try {
		  if (!!escrowContract) {
			const signer = library.getSigner();
	  
			// the erc20 we will authorize the contract to send for us to the initiator
			const tokenContract = new ethers.Contract(counterpartyCurrency, ERC20ABI, signer);
	  
			// todo: calculate more dynamically
			const neededAllowance = requiredAmount;
			
			const approveTx = await tokenContract.approve(escrowContract.target, neededAllowance);
	  
			// now we instruct the escrow contract to disperse funds to each party
			const tx = await escrowContract.fillAgreement(agreementId);
		  }
		} catch (error) {
		  console.log('An error occurred: ', error);
		}
	  
	  }, [escrowContract]);
	  

	return (
		<div className={classNames('card', { cancelled: isCancelled, filled: isFilled })}>
			<div className='subtitle'>
				initiatorAddress: {initiatorAddress} {isMyAgreement && <span className='neon-text'>(you)</span>}
			</div>
			<hr />
			<div className='subtitle'>offers</div>
			<span className='neon-text'>{(+suppliedAmountWhole).toLocaleString()}</span> x <span className='neon-text'>{initiatorCurrency}</span>
			<br/>
			<br/>
			<br/>
			<div className='subtitle'>wants in return</div>
			<span className='neon-text'>{(+requiredAmountWhole).toLocaleString()}</span>  of <span className='neon-text'>{counterpartyCurrency}</span>
			<br/>
			<br/>
			{!isCancelled && <>
				{isMyAgreement && !isFilled && <button className='button' onClick={() => cancelAgreement(id)}>cancel</button>}
				{!isMyAgreement && !isFilled && <button className='button' onClick={() => fillAgreement(id)}>[fill]</button>}
			</>}
		</div>
	);
}

export default EscrowAgreement;

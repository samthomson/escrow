import React from 'react';
import { ethers, Contract } from 'ethers';
import classNames from 'classnames'

import * as Types from '../declarations'

interface EscrowAgreementProps {
	id: number
	agreement: Types.EscrowAgreement
	myAddress: Types.Address
	contract: Contract
}

const EscrowAgreement: React.FC<EscrowAgreementProps> = ({id, agreement, myAddress, contract}) => {
  // component logic goes here

	const isMyAgreement = agreement.initiator.initiatorAddress === myAddress
	const { isFilled, initiator, counterparty, isCancelled } = agreement
	const { initiatorAddress, suppliedAmount, currency: initiatorCurrency } = initiator
	const suppliedAmountWhole = ethers.formatUnits(suppliedAmount.toString(), 18)

	const { requiredAmount, currency: counterpartyCurrency } = counterparty
	const requiredAmountWhole = ethers.formatUnits(requiredAmount.toString(), 18)

	const cancelAgreement = async (id: number) => {
		// event.preventDefault();
		// const contract = new ethers.Contract(contractAddress, contractABI, library.getSigner());
		const tx = await contract.cancelAgreement(id);
		console.log(tx)
		// await tx.wait();
	}

	return (
		<div className={classNames('card', { cancelled: isCancelled })}>
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
				{!isMyAgreement && !isFilled && <button className='button'>[fill]</button>}
				{isFilled && <span>[filled]</span>}
			</>}
		</div>
	);
}

export default EscrowAgreement;

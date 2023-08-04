import React from 'react';
import { ethers } from 'ethers';

import * as Types from '../declarations'

interface EscrowAgreementProps {
	agreement: Types.EscrowAgreement
	myAddress: Types.Address
}

const EscrowAgreement: React.FC<EscrowAgreementProps> = ({agreement, myAddress}) => {
  // component logic goes here

  const isMyAgreement = agreement.initiator.initiatorAddress === myAddress
	const { isFilled, initiator, counterparty } = agreement
	const { initiatorAddress, suppliedAmount, currency: initiatorCurrency } = initiator
	const suppliedAmountWhole = ethers.formatUnits(suppliedAmount.toString(), 18)

	const { requiredAmount, currency: counterpartyCurrency } = counterparty
	const requiredAmountWhole = ethers.formatUnits(requiredAmount.toString(), 18)

  return (
    <div className='card'>
    	<div className='subtitle'>initiatorAddress: {initiatorAddress} {isMyAgreement && <span className='neon-text'>(you)</span>}</div>
		
    	<div className='subtitle'>offers</div> <span className='neon-text'>{(+suppliedAmountWhole).toLocaleString()}</span> x <span className='neon-text'>{initiatorCurrency}</span> <br/>
		
		<br/><br/>
    	<div className='subtitle'>wants in return</div>
		<span className='neon-text'>{(+requiredAmountWhole).toLocaleString()}</span>  of <span className='neon-text'>{counterpartyCurrency}</span>
		<br/><br/>
		{isMyAgreement && !isFilled && <button className='button'>[cancel]</button>}
		{!isMyAgreement && !isFilled && <button className='button'>[fill]</button>}
		{isFilled && <span>[filled]</span>}
    </div>
  );
}

export default EscrowAgreement;

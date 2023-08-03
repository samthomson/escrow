import React from 'react';

import * as Types from '../declarations'

interface EscrowAgreementProps {
	agreement: Types.EscrowAgreement
	myAddress: Types.Address
}

const EscrowAgreement: React.FC<EscrowAgreementProps> = ({agreement, myAddress}) => {
  // component logic goes here

  const isMyAgreement = agreement.initiator.initiatorAddress === myAddress
	const { isFilled } = agreement

  return (
    <div className='card'>
    	<div className='subtitle'>initiatorAddress: {agreement.initiator.initiatorAddress} {isMyAgreement && <span className='neon-text'>(you)</span>}</div>
		
    	<div className='subtitle'>offers</div> <span className='neon-text'>{agreement.initiator.suppliedAmount.toString()}</span> x <span className='neon-text'>{agreement.initiator.currency}</span> <br/>
		
		<br/><br/>
    	<div className='subtitle'>wants in return</div>
		<span className='neon-text'>{agreement.counterparty.requiredAmount.toString()}</span>  of <span className='neon-text'>{agreement.counterparty.currency}</span>
		<br/><br/>
		{isMyAgreement && !isFilled && <button className='button'>[cancel]</button>}
		{!isMyAgreement && !isFilled && <button className='button'>[fill]</button>}
		{isFilled && <span>[filled]</span>}
    </div>
  );
}

export default EscrowAgreement;

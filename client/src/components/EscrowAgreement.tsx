import React from 'react';

import * as Types from '../declarations'

interface EscrowAgreementProps {
	agreement: Types.EscrowAgreement
	myAddress: Types.Address
}

const EscrowAgreement: React.FC<EscrowAgreementProps> = ({agreement, myAddress}) => {
  // component logic goes here

  return (
    <div className='card'>
    	<div className='subtitle'>initiatorAddress: {agreement.initiator.initiatorAddress} {agreement.initiator.initiatorAddress === myAddress && <span className='neon-text'>(you)</span>}</div>
		
    	<div className='subtitle'>offers</div> <span className='neon-text'>{agreement.initiator.suppliedAmount} {agreement.initiator.currency}</span> <br/>
		
		<br/><br/>
    	<div className='subtitle'>wants in return</div>
		<span className='neon-text'>{agreement.counterparty.requiredAmount}  {agreement.counterparty.currency}</span>
		<br/>
		filled: {String(agreement.isFilled)}<br/>
    </div>
  );
}

export default EscrowAgreement;

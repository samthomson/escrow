import React from 'react';

import * as Types from '../declarations'

interface EscrowAgreementProps {
	agreement: Types.EscrowAgreement
}

const EscrowAgreement: React.FC<EscrowAgreementProps> = ({agreement}) => {
  // component logic goes here

  return (
    <div className='card'>
		initiatorAddress: {agreement.initiator.initiatorAddress}<br/>
		currency: {agreement.initiator.currency}<br/>
		suppliedAmount: {agreement.initiator.suppliedAmount}<br/>
		<br/>
		currency: {agreement.counterparty.currency}<br/>
		requiredAmount: {agreement.counterparty.requiredAmount}<br/>
		<br/>
		filled: {String(agreement.isFilled)}<br/>
    </div>
  );
}

export default EscrowAgreement;

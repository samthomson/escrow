import React from 'react';
import ConnectAccount from './ConnectAccount'
import EscrowContractInteraction from './EscrowContractInteraction'
import { useWeb3React } from '@web3-react/core'


const Main: React.FC = () => {
	const { account } = useWeb3React()

	return (
		<div>
			<div className='header'>
				<div className='title'>Escrow dapp</div>
				<div className='connection'><ConnectAccount /></div>
			</div>
			
			<hr />
			{!account && <>[not connected]</>}
			{!!account && <EscrowContractInteraction />}
		</div>
	);
};

export default Main;

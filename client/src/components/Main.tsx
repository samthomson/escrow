import React from 'react';
import ConnectAccount from './ConnectAccount'
import { useWeb3React } from '@web3-react/core'


const Main: React.FC = () => {
	const { account } = useWeb3React()

	return (
		<div>
			<h1>This is the Main Component</h1>
			<ConnectAccount />
			<hr />
			{!account && <>[not connected]</>}
			{!!account && <>[connected {account}]</>}
		</div>
	);
};

export default Main;

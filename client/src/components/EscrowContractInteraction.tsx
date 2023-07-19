import React from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core'


const EscrowContractInteraction: React.FC = () => {
	const [contractData, setContractData] = React.useState(null);

	const { library, account } = useWeb3React();

	const contractABI = [
		{
			"inputs": [],
			"name": "whoAmI",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function",
			"constant": true
		}
	]


	const contractAddress = '0xCC496B2BE6DB2398A661d9d13CC378B132289826';


	React.useEffect(() => {
		if (library && account) {
			const contract = new ethers.Contract(contractAddress, contractABI, library.getSigner());

			// replace 'myMethod' with the name of your contract's method you want to call
			contract.whoAmI().then((data) => {
				setContractData(data);
			});
		}
	}, [library, account])



	return (
		<div>
			<h1>Contract Data: {contractData}</h1>
		</div>
	);
};

export default EscrowContractInteraction;

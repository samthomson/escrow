const { Web3 } = require('web3');
const fs = require('fs');
require('dotenv').config();
const { ALCHEMY_OPTIMISM_GOERLI_KEY, ESCROW_DEPLOYED_ADDRESS } = process.env;


// Set up web3 object pointing to the provider (Infura/RPC)
const web3 = new Web3(`https://opt-goerli.g.alchemy.com/v2/${ALCHEMY_OPTIMISM_GOERLI_KEY}`);

// Load contract ABI (you can generate this from the Solidity compiler)
const { abi: contractABI } = JSON.parse(fs.readFileSync('./build/contracts/Escrow.json', 'utf-8'));

// Set up the contract instance
const contract = new web3.eth.Contract(contractABI, ESCROW_DEPLOYED_ADDRESS);


// Use the methods provided by web3.js to interact with the contract
const test = async () => {
	const res = await contract.methods.whoAmI().call()

	console.log('res', res)
}
test()
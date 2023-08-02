import { Web3 } from 'web3'
import fs from 'fs'
require('dotenv').config();

const { ESCROW_DEPLOYED_ADDRESS } = process.env;


// Set up web3 object pointing to the provider (Infura/RPC)
const web3 = new Web3('127.0.0.1:8445');

// Load contract ABI (you can generate this from the Solidity compiler)
const { abi: contractABI } = JSON.parse(fs.readFileSync('../build/contracts/Escrow.json', 'utf-8'));

// Set up the contract instance
const contract = new web3.eth.Contract(contractABI, ESCROW_DEPLOYED_ADDRESS);


// Use the methods provided by web3.js to interact with the contract
const test = async () => {
	// const res = await contract.methods.whoAmI().call()

	// console.log('res', res)
}
test()
const EscrowContract = artifacts.require("Escrow");

module.exports = function (deployer) {
	deployer.deploy(EscrowContract);
};
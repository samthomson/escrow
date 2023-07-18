const MyContract = artifacts.require("Escrow");

module.exports = function (deployer) {
	deployer.deploy(MyContract);
};
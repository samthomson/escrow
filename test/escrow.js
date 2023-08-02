const Escrow = artifacts.require("Escrow");
// import { Web3 } from 'web3'
const Web3 = require('web3');
require('dotenv').config();
const truffleAssert = require('truffle-assertions');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

const accountNinePrivateKey = process.env.ACC_9_PRIVATE_KEY || ''
assert(accountNinePrivateKey !== '', 'missing private key 9')
const accountNine = web3.eth.accounts.privateKeyToAccount(accountNinePrivateKey);


contract("Escrow", function (/* accounts */) {
  it("should assert true", async function () {
    await Escrow.deployed();
    return assert.isTrue(true);
  });

  it("can create an escrow aggreement", async () => {
    const escrowInstance = await Escrow.deployed();

    const TeToAddress = '0x36e6040b4186F9f0Ad9b3c25a9C1c9EE58112D0a'

		// todo: can these amounts be eth agnostic
    const initiatorSuppliedAmmount = web3.utils.toWei("1", "ether")
    const ReToAddress = '0x540053115bA579EB32aCddfaFe2d121340553411'
    const counterPartyRequiredAmmount = web3.utils.toWei("1000", "ether") // todo: make non-eth number

    const tx = await escrowInstance.createAgreement(
      TeToAddress,
      initiatorSuppliedAmmount,
      ReToAddress,
      counterPartyRequiredAmmount,
      { from: accountNine.address, value: initiatorSuppliedAmmount }
    );

    const agreement = await escrowInstance.agreements(0);

    assert.equal(agreement.initiator.initiatorAddress, accountNine.address, "Initiator address is incorrect");
    assert.equal(agreement.initiator.currency, TeToAddress, "Initiator currency is incorrect");
    assert.equal(agreement.initiator.suppliedAmount, initiatorSuppliedAmmount, "Initiator supplied amount is incorrect");
    assert.equal(agreement.counterparty.currency, ReToAddress, "Counterparty currency is incorrect");
    assert.equal(agreement.counterparty.requiredAmount, counterPartyRequiredAmmount, "Counterparty required amount is incorrect");
    assert.equal(agreement.isFilled, false, "Agreement isFilled field is incorrect");

    truffleAssert.eventEmitted(tx, 'AgreementCreated', (ev) => {
        return ev.agreementId.toNumber() === 0;
    })
  })
});

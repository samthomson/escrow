const Escrow = artifacts.require("Escrow");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Escrow", function (/* accounts */) {
  it("should assert true", async function () {
    await Escrow.deployed();
    return assert.isTrue(true);
  });

  it("can create an escrow aggreement", async () => {
    const escrowInstance = await Escrow.deployed();

    const creationResult = await escrowInstance.createAgreement(
      // todo
    );

    // todo
    // assert.equal(typeof whoAmI, 'string')
  })

  it("can retrieve all escrow aggreements", async () => {
    // todo
  })
});

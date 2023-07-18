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

  it("whoAmI returns an address", async () => {
    const escrowInstance = await Escrow.deployed();

    const whoAmI = await escrowInstance.whoAmI();

    assert.equal(typeof whoAmI, 'string')
  })
});

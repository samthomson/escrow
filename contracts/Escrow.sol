// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Escrow {
    // constructor() public {}

    function whoAmI() public view returns (address) {
        return msg.sender;
    }
}

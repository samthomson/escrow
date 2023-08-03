// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Escrow {

    using SafeERC20 for IERC20;

    struct Initiator {
        address initiatorAddress;
        address currency;
        uint256 suppliedAmount;
    }

    struct Counterparty {
        address currency;
        uint256 requiredAmount;
    }

    struct Agreement {
        Initiator initiator;
        Counterparty counterparty;
        bool isFilled;
    }

    mapping(uint256 => Agreement) public agreements;
    uint256 public agreementCounter = 0;

    event AgreementCreated(uint256 agreementId, address initiatorAddress, address initiatorCurrency, uint256 initiatorSuppliedAmount, address counterpartyCurrency, uint256 counterpartyRequiredAmount);


    function createAgreement(
        // address,
        address initiatorCurrency,
        uint256 initiatorSuppliedAmount,
        address counterPartyCurrency,
        uint256 counterPartyRequiredAmount
    ) public payable {
        
        IERC20 token = IERC20(initiatorCurrency);
        
        uint256 balanceBefore = token.balanceOf(address(this));
        token.safeTransferFrom(msg.sender, address(this), initiatorSuppliedAmount);
        uint256 balanceAfter = token.balanceOf(address(this));

        require(balanceAfter - balanceBefore == initiatorSuppliedAmount, "Sent amount does not match the supplied amount");

        Initiator memory newInitiator = Initiator(
            msg.sender,
            initiatorCurrency,
            initiatorSuppliedAmount
        );
        Counterparty memory newCounterparty = Counterparty(
            counterPartyCurrency,
            counterPartyRequiredAmount
        );

        Agreement memory newAgg = Agreement(
            newInitiator,
            newCounterparty,
            false
        );

        agreements[agreementCounter] = newAgg;

        emit AgreementCreated(agreementCounter, msg.sender, initiatorCurrency, initiatorSuppliedAmount, counterPartyCurrency, counterPartyRequiredAmount);

        agreementCounter += 1;    
    }
}

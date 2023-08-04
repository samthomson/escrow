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
        bool isCancelled;
    }

    mapping(uint256 => Agreement) public agreements;
    uint256 public agreementCounter = 0;

    event AgreementCreated(uint256 agreementId, address initiatorAddress, address initiatorCurrency, uint256 initiatorSuppliedAmount, address counterpartyCurrency, uint256 counterpartyRequiredAmount);


    event AgreementCancelled(uint256 agreementId);

    event AgreementFilled(uint256 agreementId);

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
            false,
            false
        );

        agreements[agreementCounter] = newAgg;

        emit AgreementCreated(agreementCounter, msg.sender, initiatorCurrency, initiatorSuppliedAmount, counterPartyCurrency, counterPartyRequiredAmount);

        agreementCounter += 1;    
    }

    function cancelAgreement(uint256 agreementId) public {
        // Ensure the agreement exists
        require(agreementId < agreementCounter, "This agreement does not exist");

        // Ensure the sender is the initiator of the agreement
        require(msg.sender == agreements[agreementId].initiator.initiatorAddress, "Only the initiator can cancel this agreement");

        // Ensure the agreement isn't already cancelled
        require(!agreements[agreementId].isCancelled, "This agreement is already cancelled");

        // Cancel the agreement
        agreements[agreementId].isCancelled = true;

        emit AgreementCancelled(agreementId);
    }

    function fillAgreement(uint256 agreementId) public payable {
        // Ensure the agreement exists
        require(agreementId < agreementCounter, "This agreement does not exist");
        
        // Ensure the agreement is not filled
        require(!agreements[agreementId].isFilled, "This agreement is already filled");
        
        // Ensure the agreement isn't cancelled
        require(!agreements[agreementId].isCancelled, "This agreement is cancelled");
        
        // Get the counterparty's currency and required amount
        address counterpartyCurrency = agreements[agreementId].counterparty.currency;
        uint256 counterpartyRequiredAmount = agreements[agreementId].counterparty.requiredAmount;
        
        // Create a contract instance for the counterparty's currency
        IERC20 counterpartyToken = IERC20(counterpartyCurrency);
        
        // Transfer the counterparty's funds to this contract
        counterpartyToken.safeTransferFrom(msg.sender, address(this), counterpartyRequiredAmount);
        
        // Ensure the transferred amount matches the required amount
        require(counterpartyToken.balanceOf(address(this)) >= counterpartyRequiredAmount, "Transferred amount does not match the required amount");
        
        // Get the initiator's currency and supplied amount
        address initiatorCurrency = agreements[agreementId].initiator.currency;
        uint256 initiatorSuppliedAmount = agreements[agreementId].initiator.suppliedAmount;
        
        // Create a contract instance for the initiator's currency
        IERC20 initiatorToken = IERC20(initiatorCurrency);
        
        // Transfer the initiator's funds to the counterparty
        initiatorToken.safeTransfer(msg.sender, initiatorSuppliedAmount);
        
        // Transfer the counterparty's funds to the initiator
        counterpartyToken.safeTransfer(agreements[agreementId].initiator.initiatorAddress, counterpartyRequiredAmount);
        
        // Mark the agreement as filled
        agreements[agreementId].isFilled = true;
        
        emit AgreementFilled(agreementId);
    }
}

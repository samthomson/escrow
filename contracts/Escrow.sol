// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Escrow {
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
        require(
            msg.value == initiatorSuppliedAmount,
            "Sent amount does not match the supplied amount"
        );

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

pragma solidity >=0.4.21 <0.6.0;

import "./Bank.sol";

contract Store {
    Bank bank;

    int256[] purchases;

    constructor(address bankAddr) public {
        bank = Bank(bankAddr);
    }

    function confirmPurchase(int256 amount) public {
        addPurchase(amount);
    }

    function addPurchase(int256 amount) private {
        purchases.push(amount);
    }

    function sendToTheBank() public returns (int256) {
        int256 total = 0;

        for (uint256 i = 0; i < purchases.length; i++) {
            total += getPurchase(i);
        }

        purchases.length = 0;

        return bank.deposit(msg.sender, total, true);
    }

    function getPurchase(uint256 i) private returns (int256) {
        return purchases[i];
    }
}

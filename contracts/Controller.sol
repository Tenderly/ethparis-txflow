pragma solidity >=0.4.21 <0.6.0;

import "./Store.sol";

contract Controller {
    Store store;

    constructor(address storeAddr) public {
        store = Store(storeAddr);
    }

    function start() public returns (int256) {
        processPurchases();

        commitPurchases();
    }

    function processPurchases() public {
        store.confirmPurchase(100);
        store.confirmPurchase(200);
        store.confirmPurchase(200);
    }

    function commitPurchases() public returns (int256) {
        store.sendToTheBank();

        processPurchases();

        return store.sendToTheBank();
    }
}

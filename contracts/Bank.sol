pragma solidity >=0.4.21 <0.6.0;

contract Bank {

    int public txCount;

    mapping(address => int256) public balances;

    function deposit(address to, int256 amount, bool secure) public returns (int256) {
        int256 newBalance = tracingAdd(to, amount);

        secureStore(to, amount, secure);

        return newBalance;
    }

    function tracingAdd(address to, int256 amount) private returns (int256){
        incrementTxCount(1);

        int256 start = balances[to];

        return start + amount;
    }

    function secureStore(address to, int256 newBalance, bool secure) private {
        if (secure) {
            incrementTxCount(2);
        }

        storeBalance(to, newBalance);
    }

    function incrementTxCount(int256 i) private {
        txCount += i;
    }

    function storeBalance(address to, int256 newBalance) private {
        balances[to] = newBalance;
    }
}

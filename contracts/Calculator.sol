pragma solidity >=0.4.21 <0.6.0;

contract CalculatorStorage {
    int value;

    function get() public returns (int) {
        return value;
    }

    function set(int newValue) public {
        superSet(newValue);
    }

    function superSet(int newValue) private {
        value = newValue;
    }
}

contract Calculator {
    CalculatorStorage store;
    int counter;

    constructor(address storeAddr) public {
        store = CalculatorStorage(storeAddr);
    }

    function add(int x) public returns (int) {
        int res = store.get() + x;

        store.set(res);

        return res;
    }

    function sub(int x) public returns (int) {
        int res = store.get() - x;

        store.set(res);

        return res;
    }

    function mul(int x) public returns (int) {
        int acc = store.get();
        for (int i = 0; i < x - 1; i++) {
            acc = innerAdd(acc);
        }

        store.set(acc);

        return acc;
    }

    function innerAdd(int x) private returns (int) {
        counter++;

        return x + store.get();
    }

    function div(int x) public returns (int) {
        int res = store.get() / x;

        store.set(res);

        return res;
    }

    function testFunc(int8 x, int y, uint256 z, bool a, address b) public returns (int) {
        counter++;

        return testInternal(x, y, z, a, b);
    }

    function testInternal(int8 x, int y, uint256 z, bool a, address b) private returns (int) {
        counter++;

        return counter;
    }
}

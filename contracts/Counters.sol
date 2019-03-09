pragma solidity >=0.4.0 <0.6.0;

contract Counters {
    mapping(address => uint256[]) public countersByUser;

    function newCounter() public returns (uint256) {
        return countersByUser[msg.sender].push(0) - 1;   
    }

    function incrementCounter(uint256 index, uint256 amount) public returns (uint256) {
        uint256 prevValue = getCounter(index);

        uint256 newValue = prevValue + amount;

        setCounter(index, newValue);

        return newValue;
    }
    
    function setCounter(uint256 index, uint256 newValue) public {
        uint256[] storage counters = getCounters();

        return setCounterByIndex(counters, index, newValue);
    }

    function setCounterByIndex(uint256[] storage counters, uint256 index, uint256 newValue) private {
        counters[index] = newValue;
    }

    function getCounter(uint256 index) public view returns(uint256) {
        uint256[] storage counters = getCounters();

        return getCounterByIndex(counters, index);
    }

    function getCounterByIndex(uint256[] storage counters, uint256 index) private view returns (uint256) {
        uint256 counter = counters[index];

        return counter;
    }

    function getCounters() private view returns (uint256[] storage) {
        return countersByUser[msg.sender];
    }
}

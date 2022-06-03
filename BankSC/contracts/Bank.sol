// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Bank {
    // mapping(address => uint) balances;
    mapping(address => uint) private balances;
    // mapping(address => mapping(uint => uint))

    function deposit() public payable {
      balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) public {
        require(balanceOf(msg.sender) >= _amount, "Need to have a balance.");
        require(balanceOf(msg.sender) - _amount >= 0, "Insufficient balance.");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function balanceOf(address _address) public view returns (uint) {
        return balances[_address];
    }
}

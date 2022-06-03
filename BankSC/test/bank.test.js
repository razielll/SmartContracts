const Bank = artifacts.require('Bank.sol');

contract("Bank", async accounts => {
  // let balance = -9999;

  const account_one = accounts[0];
  const account_two = accounts[1];

  it("Should deposit 1 Eth to accounts[1]", async () => {
    const bank = await Bank.deployed();
    const depositor = account_two;
    
    const amount = web3.utils.toWei('1', 'ether');
    // no args, value is passed as msg.value to the contract
    await bank.deposit({ from: depositor, value: amount });

    let balance = await bank.balanceOf(depositor);
    balance = parseInt(web3.utils.fromWei(balance, 'ether'));

    assert.equal(
      balance,
      1,
      "Amount wasn't correctly set"
    );
  })

  it("Should deposit 3 and withdraw 2 ", async () => {
    const bank = await Bank.new();
    const depositor = account_two;

    const amount = web3.utils.toWei('3', 'ether');

    await bank.deposit({ from: depositor, value: amount });

    // let bankTotalBalance = await web3.eth.getBalance(bank.address);
    // bankTotalBalance = parseInt(web3.utils.fromWei(bankTotalBalance));
    // console.log('Bank balance:', bankTotalBalance);

    const withdrawAmount = web3.utils.toWei('2', 'ether');
    await bank.withdraw(withdrawAmount, { from: depositor });

    let balance = await bank.balanceOf(depositor);
    balance = parseInt(web3.utils.fromWei(balance, 'ether'));

    assert.equal(
      balance,
      1,
      "Should equal 1"
    );
  })

})

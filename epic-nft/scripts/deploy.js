const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
  const nftContract = await nftContractFactory.deploy()
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  let txn = await nftContract.makeAnEpicNFT(); // call the function
  await txn.wait();  // Wait for it to be mined.
  console.log("Minted NFT #1");

  txn = await nftContract.makeAnEpicNFT()
  await txn.wait()
  console.log("Minted NFT #2")
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (e) {
    console.log('Error: ', e);
    process.exit(1);
  }
}

runMain();


// first deployed 0x565fdf4DF4d4c08aacE4614c9625D19BcB170360
// 0xCF401892e29b14938E57007cCF07208E5D4B8C3a
// 0x4DCf836a44A6F292fA4CD1Af0fB87C986e054937
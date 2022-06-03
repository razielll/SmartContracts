// It's good practice to separate your deploy script from your run.js script. 
// run.js is where we mess around a lot, we want to keep it separate.

const main = async () => {
  /* This will actually compile our contract and generate
  ** the necessary files we need to work with our contract under 
  ** the artifacts directory. Go check it out after you run this. */
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();

  // wait until contract is actually mined and deployed
  await nftContract.deployed(); 
  console.log("Contract deployed to:", nftContract.address);

  
  let txn = await nftContract.makeAnEpicNFT(); // Call the function.
  await txn.wait(); // Wait for it to be mined.

  txn = await nftContract.makeAnEpicNFT(); // Mint another NFT for fun.
  await txn.wait();  // Wait for it to be mined.

}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch(e) {
    console.log(`Error :${e}`);
    process.exit(1);
  }
}

runMain();
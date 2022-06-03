require("@nomiclabs/hardhat-waffle");
// Import and configure dotenv
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  networks: {
    // rinkeby: {
    //   url: "https://eth-rinkeby.alchemyapi.io/v2/ERMGhXoByPVqUdXp7OeVCBvZx3O4qGAM",
    //   accounts: ["8a32c1a8ebcf4e632f2a9728396fabb92abeeec03da6cb5317b6240131607223"]
    // },
    rinkeby: {
      // chainId: 4,
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  }
};


// Deployed on rinkeby at 0x63beb9B27AEe427dCE270EB19Ce5dc60031B6faE

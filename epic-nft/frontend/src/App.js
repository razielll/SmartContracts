import React, { useState, useEffect } from 'react';
import axios from 'axios';
import myEpicNft from './utils/MyEpicNFT.json';
import { ethers } from 'ethers';

import './App.css';

// Replace with your Alchemy API key:
const apiKey = "ERMGhXoByPVqUdXp7OeVCBvZx3O4qGAM";
const baseURL = `https://eth-rinkeby.alchemyapi.io/v2/${apiKey}/getNFTs/`;

// Replace with the wallet address you want to query for NFTs:
const ownerAddr = "0xbd011328bec7f578a689f48f648c04c97908094a";

// Construct the axios request:
var config = {
  method: 'get',
  url: `${baseURL}?owner=${ownerAddr}`
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [userNFTS, setUserNFTS] = useState([]);
  const CONTRACT_ADDRESS = "0x5dCE91d5425A87d83e11466765b2ee27093c1d75";

  useEffect(() => {
    checkIfWalletIsConnected();
    checkChain();
  }, [])

  const checkChain = async () => {
    let chainId = await window.ethereum.request({ method: 'eth_chainId' });
    // console.log("Connected to chain " + chainId);
    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }
  }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log('accounts', accounts);
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener()
      loadNFTS();
    } else {
      console.log("No authorized account found");
    }
  }

  const loadNFTS = () => {
    axios(config)
      .then(response => {
        // console.log(JSON.stringify(response.data.ownedNfts, null, 2));
        if (response?.data?.ownedNfts?.length > 0) {
          setUserNFTS(response.data.ownedNfts);
        }
      })
      .catch(error => console.log(error));
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener()
    } catch (error) {
      console.log(error);
    }
  }


  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log('connectedContract', await connectedContract.name());

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderNfts = () => {
    return userNFTS.map((nftEntry) => {
      // console.log('nftEntry', nftEntry)
      if (nftEntry?.error?.length) return null;
      return (
        <div className="mint-count">
          <h4>TokenID: {nftEntry.id.tokenId}</h4>
          <p>Contract {nftEntry.contract.address}</p>
          <p>Title {nftEntry.title}</p>
          <p>Desc {nftEntry.description}</p>
          <p>URI {nftEntry.tokenUri.raw}</p>
          ----------------
        </div>
      );
    });
  }

  const askContractToMintNft = async () => {

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        // this line is what actually creates the connection to our contract. 
        // It needs: the contract's address, something called an abi file, and a signer.
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);


        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  // https://testnets.opensea.io/assets/INSERT_CONTRACT_ADDRESS_HERE/INSERT_TOKEN_ID_HERE

  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {!currentAccount ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        {/* <div style={{ paddingTop: 48 }}>
          {userNFTS.length ? renderNfts() : null}
        </div> */}
        <div className="mint-count" style={{ paddingBottom: 24 }}>
          check out the full collection&nbsp;
          <a
            className="cta-button"
            style={{ color: 'inherit' }}
            href="https://testnets.opensea.io/collection/squarenft-rmoskvcwjt"
            target="_blank"
            rel="noreferrer">
            here
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
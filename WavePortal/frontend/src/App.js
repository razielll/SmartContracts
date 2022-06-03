import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ContractJSON from './utils/WavePortal.json';
import './App.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState('');
  /**
  * Create a variable here that holds the contract address after you deploy!
  */
  const contractAddress = '0xD61C996DA93c40f337BF24efc30005d0931ED515';
  const contractABI = ContractJSON.abi;

  useEffect(() => {
    checkIfWalletIsConnected();
    return () => { };
  }, []);

  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);


  const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned = waves.map(wave => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };


  // const getAllWaves = async () => {
  //   try {
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  //       const waves = await wavePortalContract.getAllWaves();

  //       let wavesCleaned = [];
  //       // const wavesCleaned = waves.map(wave => ({
  //       //   address: wave.waver,
  //       //   timestamp: new Date(wave.timestamp * 1000),
  //       //   message: wave.message
  //       // }));
  //       wavesCleaned = waves.map(({ waver, timestamp, message }) => ({ waver, timestamp, message }));
  //       //   address: wave.waver,
  //       //   timestamp: new Date(wave.timestamp * 1000),
  //       //   message: wave.message
  //       // }));
  //       // waves.forEach(wave => {
  //       //   wavesCleaned.push({
  //       //     address: wave.waver,
  //       //     timestamp: new Date(wave.timestamp * 1000),
  //       //     message: wave.message
  //       //   });
  //       // });

  //       setAllWaves(wavesCleaned);
  //     } else {
  //       console.log("Ethereum object doesn't exist!")
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account -> ', account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log('No authorized account found.');
      }
    } catch (e) {
      console.log(`Caught Err ->${e}`)
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        if (!message) return;
        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(message);
        // const waveTxn = await wavePortalContract.wave(message, { gasLimit: 450000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved *NEW* total wave count...", count.toNumber());
        setMessage('');
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getTotalWaveCount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    let count = await wavePortalContract.getTotalWaves();
    console.log('returned:', count.toNumber());
  }

  return (
    <div className='mainContainer'>

      <div className='dataContainer'>
        <div className='header'>
          👋 Hey there 500!
        </div>

        <div className='bio'>
          Messages that live on the rinkeby testnet blockchain forever ? down here
        </div>

        <input placeholder="Write a message" value={message} onChange={(e) => setMessage(e.target.value)}/>
        <button className='waveButton' onClick={wave}>
          Wave at Me
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <button className="waveButton" onClick={getTotalWaveCount}>Get count</button>
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div style={{ overflowWrap: 'break-word'}}>From address: {wave.address}</div>
              <div style={{ overflowWrap: 'break-word'}}>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App;
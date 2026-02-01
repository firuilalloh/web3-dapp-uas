import { ethers } from "ethers";
import { useState } from "react";
import { contractAddress, contractAbi } from "./KeyContract";

const SEPOLIA_CHAIN_ID = "0xaa36a7";

function WalletConnect() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Silakan install MetaMask");
      return;
    }

    try {
      const currentChain = await window.ethereum.request({
        method: "eth_chainId",
      });

      if (currentChain !== SEPOLIA_CHAIN_ID) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);

      setAccount(address);
      setBalance(Number(balanceEth).toFixed(4));
    } catch (err) {
      console.error(err);
      alert("Gagal connect wallet / switch network");
    }
  };

  const donate = async () => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    const tx = await contract.donate({
      value: ethers.parseEther("0.01"),
    });

    await tx.wait();

    window.dispatchEvent(new Event("donationSuccess"));
  };

  return (
    <div className="wallet-card">
      <h3>Wallet (Sepolia)</h3>

      {account ? (
        <>
          <p className="wallet-address">
            {account.slice(0, 6)}...{account.slice(-4)}
          </p>
          <p className="wallet-balance">{balance} ETH</p>
        </>
      ) : (
        <p>Wallet belum terhubung</p>
      )}
      <div className="wallet-button">
        <button onClick={connectWallet}>
          {account ? "Connected" : "Connect MetaMask"}
        </button>
        <button onClick={donate}>Donate 0.01 ETH</button>
      </div>
    </div>
  );
}

export default WalletConnect;

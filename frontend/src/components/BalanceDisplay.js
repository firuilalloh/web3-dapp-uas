import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "./KeyContract";

function BalanceDisplay() {
  const [balance, setBalance] = useState("0");

  const fetchBalance = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );

      const total = await contract.totalDonations();
      setBalance(ethers.formatEther(total));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="balance-card">
      <h3>Total Donasi</h3>
      <p className="balance-amount">{balance} ETH</p>
      <button onClick={fetchBalance}>Refresh</button>
    </div>
  );
}

export default BalanceDisplay;

import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "./KeyContract";

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Ambil data dari Blockchain
  const fetchContractDonations = async () => {
    if (!window.ethereum) return [];
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider,
      );

      const donorCount = await contract.getDonorCount();
      const txs = [];

      for (let i = 0; i < donorCount; i++) {
        const donor = await contract.donors(i);
        txs.push({
          id: `chain-${i}`,
          from: donor.addr,
          amount: ethers.formatEther(donor.amount),
          source: "Blockchain",
          timestamp: Date.now(), // Fallback jika kontrak tidak simpan waktu
        });
      }
      return txs;
    } catch (err) {
      console.error("Error Blockchain:", err);
      return [];
    }
  };

  // 2. Ambil data dari API Lokal
  const fetchApiTransactions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/transactions");
      const result = await response.json();

      // Cek apakah data ada di dalam properti tertentu (misal result.data atau result.transactions)
      // Jika result sendiri sudah array, gunakan result. Jika tidak, coba cari array di dalamnya.
      const rawData = Array.isArray(result)
        ? result
        : result.transactions || result.data || [];

      if (!Array.isArray(rawData)) {
        console.error("API tidak mengembalikan array:", result);
        return [];
      }

      return rawData.map((tx, index) => ({
        id: tx._id || `api-${index}`,
        from: tx.from || tx.sender || tx.walletAddress || "Unknown",
        amount: tx.amount,
        source: "API/Database",
        timestamp: new Date(tx.createdAt || tx.date || Date.now()).getTime(),
      }));
    } catch (err) {
      console.error("Error API:", err);
      return [];
    }
  };

  // 3. Gabungkan SEMUA data
  const loadAllTransactions = useCallback(async () => {
    try {
      setLoading(true);

      // Menjalankan fetch secara paralel
      const [chainData, apiData] = await Promise.all([
        fetchContractDonations(),
        fetchApiTransactions(),
      ]);

      // Menggabungkan array blockchain dan array API
      const combinedData = [...chainData, ...apiData];

      // Urutkan berdasarkan waktu (terbaru di atas)
      combinedData.sort((a, b) => b.timestamp - a.timestamp);

      setTransactions(combinedData);
    } catch (err) {
      console.error("Gagal load transaksi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllTransactions();

    window.addEventListener("donationSuccess", loadAllTransactions);
    return () =>
      window.removeEventListener("donationSuccess", loadAllTransactions);
  }, [loadAllTransactions]);

  return (
    <div className="tx-card">
      <h3>All Donation Transactions</h3>

      {loading && <p className="muted">Synchronizing data...</p>}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Donor Address</th>
            <th>Amount</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((tx, i) => (
              <tr key={tx.id}>
                <td>{i + 1}</td>
                <td title={tx.from}>
                  {tx.from ? `${tx.from.slice(0, 10)}...` : "N/A"}
                </td>
                <td>{tx.amount} ETH</td>
                <td>
                  <span
                    className={
                      tx.source === "Blockchain" ? "badge-chain" : "badge-api"
                    }
                  >
                    {tx.source}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;

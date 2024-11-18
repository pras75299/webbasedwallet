import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const EthWallet = ({ mnemonic, disabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [balances, setBalances] = useState({});
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  // Use Alchemy as the provider with your API key
  const provider = new ethers.AlchemyProvider(
    "mainnet",
    "AAsuireGss8ZoU0addiRUyVIG5GJE9tw"
  );

  const fetchBalance = async (address) => {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance); // Converts balance to ETH in v6
  };

  const updateBalances = async () => {
    const newBalances = {};
    for (const address of addresses) {
      newBalances[address] = await fetchBalance(address);
    }
    setBalances(newBalances);
  };

  useEffect(() => {
    if (addresses.length > 0) {
      updateBalances();
    }
  }, [addresses]);

  return (
    <div>
      <button
        className="wallet-button"
        disabled={disabled}
        onClick={async function () {
          // Create a wallet with the full path directly from the mnemonic
          const path = `m/44'/60'/${currentIndex}'/0/0`;
          const wallet = ethers.Wallet.fromPhrase(mnemonic, provider, path);

          setAddresses((prev) => [...prev, wallet.address]);
          setCurrentIndex(currentIndex + 1);
        }}
      >
        Generate Ethereum Wallet
      </button>

      {addresses.map((address, index) => (
        <div key={index}>
          <div>
            <strong>Address:</strong> {address}
          </div>
          <div>
            <strong>Balance:</strong> {balances[address] || "Loading..."} ETH
          </div>
        </div>
      ))}

      {/* Send ETH Form */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Recipient Address"
          onChange={(e) => setRecipient(e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Amount (ETH)"
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />
        <button
          className="send-button"
          onClick={async () => {
            const path = `m/44'/60'/${currentIndex - 1}'/0/0`;
            const wallet = ethers.Wallet.fromPhrase(mnemonic, provider, path);

            const tx = await wallet.sendTransaction({
              to: recipient,
              value: ethers.parseEther(amount), // Converts amount to Wei in v6
            });
            await tx.wait();
            alert(`Transaction successful: ${tx.hash}`);
          }}
        >
          Send ETH
        </button>
      </div>
    </div>
  );
};

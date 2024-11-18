import { useState, useEffect } from "react";
import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export function SolanaWallet({ mnemonic, disabled }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [balances, setBalances] = useState({});
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/AAsuireGss8ZoU0addiRUyVIG5GJE9tw"
  );
  const fetchBalance = async (publicKey) => {
    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance / 1e9; // Convert lamports to SOL
  };

  const updateBalances = async () => {
    const newBalances = {};
    for (const publicKey of publicKeys) {
      newBalances[publicKey.toBase58()] = await fetchBalance(publicKey);
    }
    setBalances(newBalances);
  };

  useEffect(() => {
    if (publicKeys.length > 0) {
      updateBalances();
    }
  }, [publicKeys]);

  return (
    <div>
      <button
        className="wallet-button"
        disabled={disabled}
        onClick={async function () {
          const keypair = Keypair.generate(); // Generate Solana keypair
          setPublicKeys((prev) => [...prev, keypair.publicKey]);
          setCurrentIndex(currentIndex + 1);
        }}
      >
        Generate Solana Wallet
      </button>

      {publicKeys.map((publicKey, index) => (
        <div key={index}>
          <div>
            <strong>Address:</strong> {publicKey.toBase58()}
          </div>
          <div>
            <strong>Balance:</strong>{" "}
            {balances[publicKey.toBase58()] || "Loading..."} SOL
          </div>
        </div>
      ))}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Recipient Address"
          onChange={(e) => setRecipient(e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Amount (SOL)"
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />
        <button
          className="send-button"
          onClick={async () => {
            const senderKeypair = Keypair.generate(); // Replace with stored keypair or mnemonic-derived keypair
            const transaction = new Transaction().add(
              SystemProgram.transfer({
                fromPubkey: senderKeypair.publicKey,
                toPubkey: new PublicKey(recipient),
                lamports: amount * 1e9, // Convert SOL to lamports
              })
            );

            const signature = await connection.sendTransaction(transaction, [
              senderKeypair,
            ]);
            await connection.confirmTransaction(signature);
            alert(`Transaction successful: ${signature}`);
          }}
        >
          Send SOL
        </button>
      </div>
    </div>
  );
}

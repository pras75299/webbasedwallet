import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

export function SolanaWallet({ mnemonic, disabled }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  return (
    <div className="solana-wallet">
      <button
        className="wallet-button dark:bg-gray-700 bg-gray-300 dark:hover:bg-gray-600 hover:bg-gray-400 text-gray-900 dark:text-gray-100 py-2 px-4 rounded mb-4"
        disabled={disabled}
        onClick={function () {
          const seed = mnemonicToSeed(mnemonic);
          const path = `m/44'/501'/${currentIndex}'/0'`;
          const derivedSeed = derivePath(path, seed.toString("hex")).key;
          const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
          const keypair = Keypair.fromSecretKey(secret);
          setCurrentIndex(currentIndex + 1);
          setPublicKeys([...publicKeys, keypair.publicKey]);
        }}
      >
        Generate SOLANA Wallet
      </button>

      {publicKeys.map((publicKey, index) => (
        <div
          key={index}
          className="dark:bg-gray-800 bg-gray-200 p-2 rounded mb-2"
        >
          <input
            value={`Address: ${publicKey.toBase58()}`}
            readOnly
            className="bg-transparent dark:text-gray-100 text-gray-900 w-full"
          />
        </div>
      ))}
    </div>
  );
}

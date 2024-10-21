import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

export function SolanaWallet({ mnemonic, disabled }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  return (
    <div>
      <button
        className="wallet-button"
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
        <div key={index}>
          <input value={`Address: ${publicKey.toBase58()}`} readOnly />
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";
import { generateMnemonic } from "bip39";
import "./App.css";
import { SolanaWallet } from "./SolanaWallet";
import { EthWallet } from "./EthWallet";

function App() {
  const [mnemonic, setMnemonic] = useState("");
  return (
    <>
      <h1>Web Based Wallet</h1>
      <input type="text" value={mnemonic}></input>
      <button
        onClick={async function () {
          const mn = await generateMnemonic();
          setMnemonic(mn);
        }}
      >
        Create Seed Phrase
      </button>
      <SolanaWallet />
      <EthWallet />
    </>
  );
}

export default App;

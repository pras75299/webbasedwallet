import { useState } from "react";
import { generateMnemonic } from "bip39";
import "./App.css";
import { SolanaWallet } from "./SolanaWallet";
import { EthWallet } from "./EthWallet";

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [isMnemonicVisible, setMnemonicVisible] = useState(true);
  const isDisabled = !mnemonic;
  return (
    <div className="container">
      <h1 className="text-3xl font-bold underline">Secret Phrase</h1>
      <button
        className="mnemonic-button"
        onClick={async function () {
          const mn = await generateMnemonic();
          setMnemonic(mn);
        }}
      >
        Generate Secret Phrase
      </button>

      <div className="mnemonic-container">
        <div className="mnemonic-header">
          <button
            className="hide-show-button"
            onClick={() => setMnemonicVisible(!isMnemonicVisible)}
          >
            {isMnemonicVisible ? "Hide Secret Phrase" : "Show Secret Phrase"}
          </button>
          <button className="copy-button">Copy Grid</button>
        </div>

        {isMnemonicVisible && (
          <div className="mnemonic-grid">
            {mnemonic.split(" ").map((word, index) => (
              <div key={index}>{word}</div>
            ))}
          </div>
        )}
      </div>

      <div className="wallet-container">
        <div className="wallet-box">
          <h2>Generate SOLANA Wallet</h2>
          <SolanaWallet mnemonic={mnemonic} disabled={isDisabled} />
        </div>

        <div className="wallet-box">
          <h2>Generate ETHEREUM Wallet</h2>
          <EthWallet mnemonic={mnemonic} disabled={isDisabled} />
        </div>
      </div>
    </div>
  );
}

export default App;

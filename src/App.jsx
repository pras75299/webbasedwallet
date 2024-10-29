import React, { useState, useEffect } from "react";
import { generateMnemonic } from "bip39";
import "./App.css";
import { SolanaWallet } from "./components/SolanaWallet";
import { EthWallet } from "./components/EthWallet";
import { ThemeProvider, useTheme } from "./context/Theme"; // Import useTheme here
import ThemeButton from "./components/ThemeButton";

function AppContent() {
  const [mnemonic, setMnemonic] = useState("");
  const [isMnemonicVisible, setMnemonicVisible] = useState(true);
  const isDisabled = !mnemonic;
  const { themeMode } = useTheme();

  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(themeMode);
  }, [themeMode]);

  return (
    <div className="w-full mx-auto p-4 dark:bg-gray-900 bg-white dark:text-gray-100 text-gray-900 min-h-screen">
      <ThemeButton />
      <header className="space-x-4 flex align-middle justify-between dark:bg-gray-900 bg-blue-500 p-4 rounded">
        <h1 className="text-3xl font-bold dark:text-white text-gray-800">
          Secret Phrase
        </h1>

        <button
          className="mnemonic-button dark:bg-gray-700 bg-gray-200 dark:hover:bg-gray-600 hover:bg-gray-300 text-gray-900 dark:text-gray-100 py-2 px-4 rounded"
          onClick={async function () {
            const mn = await generateMnemonic();
            setMnemonic(mn);
          }}
        >
          Generate Secret Phrase
        </button>
      </header>

      <div className="w-1/2 mnemonic-container dark:bg-gray-800 bg-gray-100 rounded-lg mt-4 p-4">
        <div className="mnemonic-header flex justify-between items-center">
          <button
            className="hide-show-button dark:bg-gray-600 bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 py-2 px-4 rounded"
            onClick={() => setMnemonicVisible(!isMnemonicVisible)}
          >
            {isMnemonicVisible ? "Hide Secret Phrase" : "Show Secret Phrase"}
          </button>
          <button className="copy-button dark:bg-gray-600 bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 py-2 px-4 rounded">
            Copy Grid
          </button>
        </div>

        {isMnemonicVisible && (
          <div className="mnemonic-grid grid grid-cols-3 gap-2 mt-4 dark:text-gray-100 text-gray-900">
            {mnemonic.split(" ").map((word, index) => (
              <div
                key={index}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded text-center"
              >
                {word}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="wallet-container mt-6">
        <div className="wallet-box dark:bg-gray-800 bg-gray-100 rounded-lg p-4 mb-4">
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">
            Generate SOLANA Wallet
          </h2>
          <SolanaWallet mnemonic={mnemonic} disabled={isDisabled} />
        </div>

        <div className="wallet-box dark:bg-gray-800 bg-gray-100 rounded-lg p-4">
          <h2 className="text-2xl font-bold  dark:text-white text-black-900">
            Generate ETHEREUM Wallet
          </h2>
          <EthWallet mnemonic={mnemonic} disabled={isDisabled} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

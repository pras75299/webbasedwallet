import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

export const EthWallet = ({ mnemonic, disabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);

  return (
    <div className="eth-wallet">
      <button
        className="wallet-button dark:bg-gray-700 bg-gray-300 dark:hover:bg-gray-600 hover:bg-gray-400 text-gray-900 dark:text-gray-100 py-2 px-4 rounded mb-4"
        disabled={disabled}
        onClick={async function () {
          const seed = await mnemonicToSeed(mnemonic);
          const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
          const hdNode = HDNodeWallet.fromSeed(seed);
          const child = hdNode.derivePath(derivationPath);
          const privateKey = child.privateKey;
          const wallet = new Wallet(privateKey);
          setCurrentIndex(currentIndex + 1);
          setAddresses([...addresses, wallet.address]);
        }}
      >
        Generate ETHEREUM Wallet
      </button>

      {addresses.map((address, index) => (
        <div
          key={index}
          className="dark:bg-gray-800 bg-gray-200 p-2 rounded mb-2"
        >
          <input
            value={`Address: ${address}`}
            readOnly
            className="bg-transparent dark:text-gray-100 text-gray-900 w-full"
          />
        </div>
      ))}
    </div>
  );
};

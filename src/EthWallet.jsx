import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

export const EthWallet = ({ mnemonic, disabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);

  return (
    <div>
      <button
        className="wallet-button"
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
        <div key={index}>
          <input value={`Address: ${address}`} readOnly />
        </div>
      ))}
    </div>
  );
};

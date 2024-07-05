import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Protected from "./routes/Protected";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { WagmiProvider, createConfig, http } from "wagmi";
import { base, baseSepolia, mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  walletConnectWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { useEffect } from "react";
import { generateToken } from "./firebase/config";
import { readContract } from "@wagmi/core";
import { blockConfig } from "./config/BlockChainConfig";
import BRABI from "./abis/breeding.json";
import NFTABI from "./abis/nft.json";
const queryClient = new QueryClient();
// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "90ef3af7bd143f24e61f7cf32182f839";

const testNetworks = [baseSepolia];
const mainNetworks = [base];

const transportstest = {
  // [sepolia.id]: http(),  //for now off this network
  [baseSepolia.id]: http(),
};
const transportMain = {
  [mainnet.id]: http(),
  [base.id]: http(),
};

const chains = import.meta.env.VITE_ENV === "dev" ? testNetworks : mainNetworks;
const transports = import.meta.env.VITE_ENV === "dev" ? transportstest : transportMain;

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, walletConnectWallet],
    },
  ],
  {
    appName: "My RainbowKit App",
    projectId: projectId,
  }
);
export const configRead = createConfig({
  connectors,
  chains: chains,
  transports: transports,
});

export const checkNftUnderBreeding = async (chainId, nftAddress, nftId) => {
  try {
    const result = await readContract(configRead, {
      abi: BRABI,
      address: blockConfig[chainId].breedingAddress,
      functionName: "isBreeding",
      args: [nftAddress, nftId],
    });
    return result;
  } catch (error) {
    return false;
  }
};
export const getCollectionName = async (nftAddress) => {
  try {
    const result = await readContract(configRead, {
      abi: NFTABI,
      address: nftAddress,
      functionName: "tokenName",
    });
    return result;
  } catch (error) {
    return false;
  }
};

function App() {
  useEffect(() => {
    generateToken();
  }, []);

  return (
    <>
      <WagmiProvider config={configRead}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={darkTheme({
              colors: {
                accentColor: "#000",
                modalBackground: "#000",
                accentColorForeground: "#000",
                closeButton: "#ff0000",
              },
            })}
          >
            <BrowserRouter>
              <Protected />
            </BrowserRouter>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{
          fontWeight: "500",
          fontSize: "14px",
          fontFamily: "LuloCleanOne-Bold",
          textTransform: "none",
        }}
        closeButton={
          <button
            style={{
              width: "30px",
              // backgroundColor: "inherit",
              border: "none",
              color: "#ff000",
              borderRadius: "50%",
            }}
          >
            X
          </button>
        }
      />
    </>
  );
}

export default App;

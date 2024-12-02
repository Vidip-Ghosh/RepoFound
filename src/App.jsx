import "./app.css"
import "./index.css"
import NavbarComponent from "./components/Navbar"
import HomeComponent from "./components/Home"
import FooterComponent from "./components/FooterComponent"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import CreateProjectComponent from "./components/CreateProjectComponent"
import ConnectWallet from "./components/ConnectWallet"
import DiscoverComponent from "./components/DiscoverComponent"
import ProjectComponent from "./components/ProjectComponent"
import ProfileComponent from "./components/ProfileComponent"
import { useState } from "react"
import { ethers } from "ethers"
import { abi } from "./abi"
const CONTRACT_ADDRESS = import.meta.env.VITE_WALLET_ADDRESS;

function App() {
  const [myContract, setMyContract] = useState(null)
  const [address, setAddress] = useState()
  let provider, signer, add

  async function changeNetwork() {
    // switch network to Intersect Testnet
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x14a34" }], // EVM Chain ID 84532 in hexadecimal is 0x14A14
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x14a34", // EVM Chain ID  in hexadecimal
                chainName: "Base Sepolia Testnet",
                nativeCurrency: {
                  name: "Ethereum",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia.base.org"],
                blockExplorerUrls: [
                  "https://sepolia.etherscan.io",
                ],
              },
            ],
          })
        } catch (addError) {
          alert("Error in adding Base Sepolia Testnet",addError)
        }
      }
    }
  }

  // Connects to Metamask and sets the myContract state with a new instance of the contract
  async function connect() {
    let res = await connectToMetamask()
    if (res === true) {
      await changeNetwork()
      provider = new ethers.providers.Web3Provider(window.ethereum)
      signer = provider.getSigner()
      add = await signer.getAddress()
      setAddress(add)

      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
        setMyContract(contract)
      } catch (err) {
        alert("CONTRACT_ADDRESS not set properly")
        console.log(err)
      }
    } else {
      alert("Couldn't connect to Metamask")
    }
  }

  // Helps open Metamask
  async function connectToMetamask() {
    try {
      await window.ethereum.enable()
      return true
    } catch (err) {
      return false
    }
  }
  const checkConnected = (component) => {
    return !myContract ? <ConnectWallet connectMetamask={connect} /> : component
  }

  const routes = [
    {
      path: "/",
      element: checkConnected(<HomeComponent contract={myContract} />),
    },
    {
      path: "/create_project",
      element: checkConnected(
        <CreateProjectComponent contract={myContract} />
      ),
    },
    {
      path: "/discover",
      element: checkConnected(
        <DiscoverComponent contract={myContract} />
      ),
    },
    {
      path: "/profile",
      element: checkConnected(
        <ProfileComponent contract={myContract} userAddress={address} />
      ),
    },
    {
      path: "/project",
      element: checkConnected(
        <ProjectComponent contract={myContract} userAddress={address} />
      ),
    },
  ];

  return (
    <div className="app">
      <BrowserRouter>
        {myContract && <NavbarComponent address={address} />}
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
        {myContract && <FooterComponent />}
      </BrowserRouter>
    </div>
  )
}

export default App

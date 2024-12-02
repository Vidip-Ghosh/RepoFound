require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.24",
  networks: {
    intersectTestnet: {
      url: "https://subnets.avax.network/pearl/testnet/rpc",
      chainId: 1612,
      accounts: [
        "89dd90b3154b0a5111c09f3f04897b9f79d2f52679afa36aa83826ac4c6f97a4",
      ],
    },
  },
};

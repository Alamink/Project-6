
const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "rinkeby.infura.io/v3/59896cba7a834f639dda5a09512716ed";
const mnemonic = ""// removed from public network.

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
      // Useful for deploying to a public network
    // NB: It's important to wrap the provider as a function.
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://${infuraKey}`),
        network_id: 4,       // rinkeby's id
        gas: 4500000,        // rinkeby has a lower block limit than mainnet
        gasPrice: 10000000000
    },
  },
  compilers:{
    solc:{
      version: "^0.4.24"
    }
  }
};
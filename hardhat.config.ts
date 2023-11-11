import { HardhatUserConfig, extendEnvironment, extendProvider, task} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();

const PRIVATE_KEY: string = String(process.env.NEXT_PUBLIC_PRIVATE_KEY);

/*
  Hardhat内置的常用任务:
  npx hardhat compile：编译Solidity合约代码。
  npx hardhat test：运行测试脚本。
  npx hardhat run [path/to/script.js]：运行一个脚本。
  npx hardhat clean：清除构建输出和缓存文件。
  npx hardhat accounts：列出可用的账户信息。
  npx hardhat node：启动本地开发节点。
*/
// 创建自定义获取账户任务
task("getAccounts", "Prints the list of accounts", async (_taskArgs: any, hre: { ethers: { getSigners: () => any; }; }) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// 创建自定义插件
extendEnvironment((hre: any) => { 
  hre.hi = "Hello, Hardhat!";
});

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defaultNetwork: 'sepolia',
  networks: {
    hardhat: {
      // forking: {
      //   url: "https://goerli.infura.io/v3/" + process.env.INFURA_API_KEY,
      // }
    },
    localhost: {
      url: 'http://127.0.0.1:7545'
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/" + process.env.NEXT_PUBLIC_ALCHEMY_Sepolia_API_KEY,
      accounts: [PRIVATE_KEY],
    },
    goerli: {
      url: "https://goerli.infura.io/v3/" + process.env.NEXT_PUBLIC_INFURA_API_KEY,
      accounts: [PRIVATE_KEY],
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/" + process.env.NEXT_PUBLIC_INFURA_API_KEY,
      accounts: [PRIVATE_KEY],
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API
  },
  mocha: {
    timeout: 40000
  },
 
};

export default config;


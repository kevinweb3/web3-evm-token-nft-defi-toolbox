import { artifacts, ethers } from "hardhat";

import fs from "fs";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

async function main() {
  const [deployer] = await ethers.getSigners();
  const address = deployer.address;
  console.log("获取部署合约账户地址：", address);

  const contractFactory = await ethers.getContractFactory("SimpleToken");
  const deployContract = await contractFactory.deploy("SimpleToken", "ST", 100000000, 10);

  // const deployContract = await ethers.deployContract("SimpleToken");

  // console.log("11", await deployContract.symbol(), await deployContract.name());

  await deployContract.waitForDeployment();

  const contractAddress = await deployContract.getAddress();
  console.log("合约部署地址：", contractAddress);

  // 获取合约信息保存传给前端
  const contractInfos = {
    contractName: await deployContract.name(),
    contractSymbol: await deployContract.symbol(),
    contractDecimals: String(await deployContract.decimals()),
    contractTotalSupply: String(await deployContract.totalSupply()),
    contractBalance: String(await deployContract.balanceOf(address)),
  };

  // 将合约地址和部署账户信息生成json文件传给前端frontend
  saveFrontendFiles(contractAddress, deployer, contractInfos);
}

function saveFrontendFiles(
  contractAddress: string,
  deployerAccount: HardhatEthersSigner,
  _contractInfos: { contractName: string; contractSymbol: string; contractDecimals: string; contractTotalSupply: string; contractBalance: string; }
) {
  const contractsDir = __dirname + "/contracts-json";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const TokenArtifact = artifacts.readArtifactSync("SimpleToken");

  const contractAddressDir = contractsDir + "/contractAddress.json";
  const deployerAccountDir = contractsDir + "/deployerAccount.json";
  const SimpleTokenDir = contractsDir + "/SimpleToken.json";
  const _contractInfosDir = contractsDir + "/ContractInfos.json";

  fs.writeFileSync(
    contractAddressDir,
    JSON.stringify({ contractAddress: contractAddress }, undefined, 2)
  );

  fs.writeFileSync(
    deployerAccountDir,
    JSON.stringify({ deployer: deployerAccount }, undefined, 2)
  );

  fs.writeFileSync(SimpleTokenDir, JSON.stringify(TokenArtifact, null, 2));
  fs.writeFileSync(_contractInfosDir, JSON.stringify(_contractInfos, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

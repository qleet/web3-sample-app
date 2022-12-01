import { ethers } from "ethers";
import Config from "@/assets/config.json";

export var provider;
export var ETHbalance;
export var ETHblock;

export var DAIContractName;
export var DAISymbol;
export var DAIBalance;
export var DAIBalanceFormatted;
export var DAIblock;

// export var RPCENDPOINT = JSON.stringify(import.meta.env.VITE_RPCENDPOINT) as string;
// export const variables = {
//   RPCENDPOINT: <string>import.meta.env.VITE_RPCENDPOINT,
//   RPCENDPOINT2: <string>process.env.VITE_RPCENDPOINT
// };

export async function getProvider() {
  provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPCENDPOINT);
  await provider.ready;
}

export async function getETHBalance(account) {
  try {
    ETHblock = 0;
    ETHbalance = 0;
    getProvider();

    return Promise.all([
      (ETHblock = await provider.getBlockNumber()),
      (ETHbalance = await provider.getBalance(account))
    ]).catch((error) => {
      console.log(error);
      return [null, null, null];
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getDAIBalance(address) {
  try {
    DAIblock = 0;
    DAIBalance = 0;
    getProvider();


    const daiAddress = "dai.tokens.ethers.eth";
    const daiAbi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function balanceOf(address) view returns (uint)",
      "function transfer(address to, uint amount)",
      "event Transfer(address indexed from, address indexed to, uint amount)"
    ];
    const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);

    return Promise.all([
      (DAIblock = await provider.getBlockNumber()),
      (DAIContractName = await daiContract.name()),
      (DAISymbol = await daiContract.symbol()),
      (DAIBalance = await daiContract.balanceOf(address)),
      (DAIBalanceFormatted = ethers.utils.formatUnits(DAIBalance, 18))
    ]).catch((error) => {
      console.log(error);
      return [null, null, null];
    });

  } catch (error) {
    console.log(error);
  }
}

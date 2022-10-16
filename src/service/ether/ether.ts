import { ethers } from 'ethers'
import { RPC_ENDPOINT } from '@/service/ether/constants/config'

export var provider
export var ETHbalance
export var ETHblock

export var DAIContractName
export var DAISymbol
export var DAIBalance
export var DAIBalanceFormatted
export var DAIblock

export function getProvider() {
  provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT)
}

export async function getETHBalance(account) {
  getProvider()
  return Promise.all([
    (ETHblock = await provider.getBlockNumber()),
    (ETHbalance = await provider.getBalance(account)),
    // const signer2 = provider.getSigner()
  ]).catch((error) => {
    console.log(error)
    return [null, null, null]
  })
}

export async function getDAIBalance(address) {
  getProvider()

  const daiAddress = 'dai.tokens.ethers.eth'
  const daiAbi = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function balanceOf(address) view returns (uint)',
    'function transfer(address to, uint amount)',
    'event Transfer(address indexed from, address indexed to, uint amount)',
  ]
  const daiContract = new ethers.Contract(daiAddress, daiAbi, provider)

  return Promise.all([
    (DAIblock = await provider.getBlockNumber()),
    (DAIContractName = await daiContract.name()),
    (DAISymbol = await daiContract.symbol()),
    (DAIBalance = await daiContract.balanceOf(address)),
    (DAIBalanceFormatted = ethers.utils.formatUnits(DAIBalance, 18)),
  ]).catch((error) => {
    console.log(error)
    return [null, null, null]
  })
}

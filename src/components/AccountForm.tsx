// AccountForm.tsx
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import {
  DAIBalance,
  DAIblock,
  ETHbalance,
  ETHblock,
  getDAIBalance,
  getETHBalance,
  getProvider,
  provider
} from "@/service/ether";
import { ethers } from "ethers";
import Config from "@/assets/config.json";
const ERRMSG = "Could not retrieve info from blockchain using\n";


const AccountForm = () => {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const [destinationAddress, setDestinationAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [block, setBlock] = useState(0);
  const [asset, setAsset] = useState("ETH");
  const [disable, setDisable] = useState(false);

  const getBlock = async () => {
    try {
      getProvider();
      await provider.getBlockNumber();
      const block = await provider.getBlockNumber();
      setBlock(block);
    } catch (error) {
      setBlock(0);
    }
  };

  useEffect(() => {
    getBlock();
  }, []);

  const getBalance = async (event: any) => {
    if (ethers.utils.isAddress(destinationAddress)) {
      setDisable(true);
    }
    setBalance(0);
    setBlock(0);
    let assetCbValue: string = (
      document.getElementById("selectAsset") as HTMLInputElement
    ).value;

    if (assetCbValue == "ETH") {
      try {
        getProvider();
        await provider.getBlockNumber();
        await getETHBalance(destinationAddress);
        setBalance(ETHbalance);
        setBlock(ETHblock);
      } catch (e) {
        console.error(e);
        alert(ERRMSG + Config.RPCENDPOINT)
      }
    } else {
      try {
        getProvider();
        await provider.getBlockNumber();
        await getDAIBalance(destinationAddress);
        setBalance(DAIBalance);
        setBlock(DAIblock);
      } catch (e) {
        console.error(e);
        alert(ERRMSG + Config.RPCENDPOINT)
      }
    }
    setDisable(false);
  };

  const handleChange = (event) => {
    try {
      setAsset(event.target.value);
      getBalance(event);
    } catch (e) {
      console.log(e.message);
      if (typeof e === "string") {
        e.toUpperCase();
      } else if (e instanceof Error) {
        console.log(e.message);
      }
    }
  };

  return (
    <div className="p-5 shadow text-left flex flex-col">
      <div className="pt-1 font-normal">
        <input
          disabled={disable}
          placeholder={t("address")}
          value={destinationAddress}
          className="w-96 border form-control mb-5 text-sm text-neutral-700"
          onChange={(event) => {
            setDestinationAddress(event.target.value);
          }}
        />
        {/*<select value={asset} disabled={disable} name="selectAsset" id="selectAsset" className="text-neutral-700"*/}
        {/*        onChange={(e) => setAsset(e.target.value)}>*/}
        <select
          value={asset}
          disabled={disable}
          name="selectAsset"
          id="selectAsset"
          className="text-neutral-700"
          onChange={handleChange}
        >
          <option value="ETH">ETH</option>
          <option value="DAI">DAI</option>
        </select>
      </div>

      <div className="pt-1 font-bold text-neutral-700">
        <>
          {t("balance")}: {ethers.utils.formatEther(balance)}
        </>
      </div>
      <div className="pt-1 font-bold text-neutral-700">
        <>
          {t("block")}: {block}
        </>
      </div>
      <div className="pt-4">
        <button
          style={{ float: "right" }}
          disabled={disable}
          id="GetBalanceButton"
          name="GetBalanceButton"
          className="text-sm bg-primary text-white px-6 py-2 btn rounded-full shadow shadow-gray-500/50"
          onClick={getBalance}
        >
          <span>Get Balance</span>
        </button>
      </div>
    </div>
  );
};

export default AccountForm;

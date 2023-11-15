import { useState, useEffect } from "react";
import styles from "/public/styles/TokensBalanceDisplay.module.css";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";
import React from "react";
import { Input } from "antd";

// Define TokensBalancePanel component
export default function TokensBalancePanel({
  walletAddress = "vitalik.eth",
  chain,
}) {
  // Define state variables using the useState hook
  const [tokensBalance, setTokensBalance] = useState();
  const [isLoading, setIsloading] = useState(false);
  const [address, setAddress] = useState();
  const { Search } = Input;
  // Define function to get token balances
  const getBalance = async () => {
    setIsloading(true);
    if (walletAddress) {
      try {
        const fetchedTokensBalance = await fetch("/api/nft/getTokensBalance", {
          method: "POST",
          body: JSON.stringify({
            address: address,
            chain: chain ? chain : "ETH_MAINNET",
          }),
        }).then((res) => res.json());
        setTokensBalance(fetchedTokensBalance);
      } catch (e) {
        console.log(e);
      }
    }
    setIsloading(false);
  };

  // Hydration error guard
  useEffect(() => {
    if (walletAddress?.length) setAddress(walletAddress);
  }, [walletAddress]);

  //   Fetch token balances when page loads

  useEffect(() => {
    if (address) getBalance();
  }, [address]);

  const onSearch = (value, _e, info) => {
    if (address) {
      getBalance();
    }
  };

  // Render TokensBalancePanel component
  return (
    <div className="flex flex-col items-center justify-between p-6">
      <Toaster position="bottom-left" toastOptions={{ duration: 5000 }} />
      <Header></Header>
      <div className="my-10 w-6/12 flex flex-col justify-center">
        <Search
          placeholder="Collection's contract address"
          enterButton="Search"
          size="large"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onSearch={onSearch}
        />
        <div className="my-2 text-xs text-gray-500 text-center">
          such as:
          polygon.eth、vitalik.eth、nftverify.eth、paycent.eth、cashteam.eth、castco.eth
        </div>
      </div>
      <div className="w-8/12 py-5 px-10 border-blue-600 border border-dashed rounded-md">
        {address?.length ? <div className={styles.header}>{address}</div> : ""}

        {isLoading
          ? "Loading..."
          : tokensBalance?.length &&
            tokensBalance?.map((token, i) => {
              const convertedBalance = Math.round(token.balance * 100) / 100;
              return (
                <div key={i} className={styles.token_container}>
                  <div className={styles.token_name_logo}>
                    {token.logo ? (
                      <div className={styles.image_container}>
                        <img src={token.logo} alt={""}></img>
                      </div>
                    ) : (
                      <div className={styles.image_placeholder_container}></div>
                    )}
                    <div className={styles.coin_name}>{token.name}</div>
                  </div>
                  <div className={styles.token_info}>
                    <div className={styles.price}>{convertedBalance}</div>
                    <div className={styles.coin_symbol}>{token.symbol}</div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

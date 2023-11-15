import styles from "/public/styles/TransactionsHistoryDisplay.module.css";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";
import React from "react";
import { Input, Table, Tooltip } from "antd";

export default function TransactionHistory({
  walletAddress = "vitalik.eth",
  chain,
  limit,
}) {
  const [isLoading, setIsloading] = useState(false);
  const [outgoingTransactionsHistory, setOutgoingTransactionsHistory] =
    useState();
  const [incomingTransactionsHistory, setIncomingTransactionsHistory] =
    useState();
  const [isIncomingTransactionsView, setIsIncomingTransactionsView] =
    useState(true);
  const [outgoingAssetTransferPageKey, setOutgoingAssetTransferPageKey] =
    useState();
  const [incomingAssetTransferPageKey, setIncomingAssetTransferPageKey] =
    useState();

  // This avoids Next.js dehydration
  const [myAddress, setMyAddress] = useState();
  const { address, isDisconnected, isConnected } = useAccount();
  const { Search } = Input;

  const columns = [
    {
      title: "TX HASH",
      dataIndex: "hash",
      key: "hash",
      render: (text) => <a>{text}</a>,
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (hash) => (
        <Tooltip placement="topLeft" title={hash}>
          {hash}
        </Tooltip>
      ),
    },
    {
      title: "FROM",
      dataIndex: "from",
      key: "from",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "TO",
      dataIndex: "to",
      key: "to",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "DATE TIME (UTC)",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "TOKEN TYPE",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "VALUE",
      dataIndex: "value",
      key: "value",
    },
  ];

  const getTransactionHistory = async () => {
    setIsloading(true);
    if (isConnected || walletAddress) {
      const transactions = await fetch("/api/nft/getTransactionsHistory", {
        method: "POST",
        body: JSON.stringify({
          // Replace with the smart contract address of the NFTs collection you're looking for
          address: isDisconnected ? walletAddress : myAddress,
          chain: chain ? chain : "ETH_MAINNET",
          incomingAssetTransferPageKey: incomingAssetTransferPageKey
            ? incomingAssetTransferPageKey
            : null,
          outgoingAssetTransferPageKey: outgoingAssetTransferPageKey
            ? outgoingAssetTransferPageKey
            : null,
          limit: limit ? limit : 100,
        }),
      });
      const res = await transactions.json();
      console.log(res, 6666);

      if (res.incomingTransactionsHistory?.length) {
        if (incomingAssetTransferPageKey) {
          setIncomingTransactionsHistory((prev) => {
            if (prev) return [...prev, ...res.incomingTransactionsHistory];
          });
        } else {
          setIncomingTransactionsHistory(res.incomingTransactionsHistory);
        }
        if (res.incomingAssetTransferPageKey?.length) {
          setIncomingAssetTransferPageKey(res.incomingAssetTransferPageKey);
        } else {
          setIncomingAssetTransferPageKey();
        }
      }
      if (res.outgoingTransactionsHistory?.length) {
        if (outgoingAssetTransferPageKey) {
          setOutgoingTransactionsHistory((prev) => {
            if (prev) return [...prev, ...res.outgoingTransactionsHistory];
          });
        } else {
          setOutgoingTransactionsHistory(res.outgoingTransactionsHistory);
        }
        if (res.outgoingAssetTransferPageKey?.length) {
          setOutgoingAssetTransferPageKey(res.outgoingAssetTransferPageKey);
        } else {
          setOutgoingAssetTransferPageKey();
        }
      }
      setIsloading(false);
    }
  };

  // This hook is used for fetching the transaction history once the user's wallet address is available
  useEffect(() => {
    if (myAddress?.length) getTransactionHistory();
  }, [myAddress]);

  // This hook is used for setting the user's wallet address once it is available from the props
  useEffect(() => {
    if (walletAddress?.length) setMyAddress(walletAddress);
  }, [walletAddress]);

  // This hook is used for setting the user's wallet address once it is available from wallet connect
  useEffect(() => {
    if (address?.length && isConnected) setMyAddress(address);
  }, [address]);

  return (
    <div className="flex flex-col items-center justify-between p-6">
      <Toaster position="bottom-left" toastOptions={{ duration: 5000 }} />
      <Header></Header>
      <div className="my-10 w-8/12 flex justify-between">
        <div className={styles.name}>
          {myAddress?.slice(0, 6) +
            "..." +
            myAddress?.slice(myAddress.length - 4)}
        </div>
        <div className={styles.tab_group}>
          <button
            className={
              !isIncomingTransactionsView
                ? styles.button_clicked
                : styles.button_unclicked
            }
            value={"send"}
            onClick={() => setIsIncomingTransactionsView(false)}
          >
            Sent
          </button>
          <button
            className={
              isIncomingTransactionsView
                ? styles.button_clicked
                : styles.button_unclicked
            }
            value={"receive"}
            onClick={() => setIsIncomingTransactionsView(true)}
          >
            Received
          </button>
        </div>
      </div>

      <div className="w-8/12">
        <Table
          columns={columns}
          bordered
          scroll={{
            y: 600,
          }}
          dataSource={
            isIncomingTransactionsView
              ? incomingTransactionsHistory
              : outgoingTransactionsHistory
          }
          pagination={{ pageSize: 20 }}
        />
        <button
          className="py-1 px-5 bg-emerald-500 text-white rounded-lg"
          onClick={() => {
            getTransactionHistory();
          }}
          disabled={
            isLoading ||
            (isIncomingTransactionsView && !incomingAssetTransferPageKey) ||
            (!isIncomingTransactionsView && !outgoingAssetTransferPageKey)
          }
        >
          next
        </button>
      </div>
    </div>
  );
}

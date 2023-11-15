import { useState } from "react";
import { useEffect } from "react";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";
import React from "react";
import { Input, Table } from "antd";

// Main component function
export default function NftCollectionSales({
  chain,
  limit,
  collectionAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
}) {
  // Set up state variables
  const [isLoading, setIsloading] = useState(false);
  const [transactions, setTransactions] = useState();
  const [address, setAddress] = useState(collectionAddress);
  const [pageKey, setPageKey] = useState();

  // Function that handles Enter key press and initiates data fetching
  const returnHandler = async (e) => {
    if (e.keyCode === 13 && address) {
      setIsloading(true);
      await getNftSales();
      setIsloading(false);
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "tokenId",
      key: "tokenId",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Price",
      dataIndex: "sellerFee",
      key: "sellerFee",
    },
    {
      title: "From Address",
      dataIndex: "sellerAddress",
      key: "sellerAddress",
    },
    {
      title: "To Address",
      dataIndex: "buyerAddress",
      key: "buyerAddress",
    },
  ];

  const { Search } = Input;

  const onSearch = (value, _e, info) => {
    if (address.length) {
      getNftSales();
    }
  };
  // Fetch data on component mount
  useEffect(() => {
    if (address.length) {
      getNftSales();
    }
  }, []);

  // Function that fetches NFT sales data
  const getNftSales = async (pagekey) => {
    // Make a POST request to the server to fetch data
    const res = await fetch("/api/nft/getNftCollectionSales", {
      method: "POST",
      body: JSON.stringify({
        // Replace with the smart contract address of the NFTs collection you're looking for
        contractAddress: address,
        chain: chain ? chain : "ETH_MAINNET",
        limit: limit ? limit : 100,
        pageKey: pagekey ? pagekey : null,
      }),
    }).then((transaction) => transaction.json());
    // If data is received successfully
    if (res.sales) {
      // If there are more pages to fetch
      if (pagekey) {
        // Add new transactions to the existing list of transactions
        setTransactions((prev) => {
          if (prev) return [...prev, ...res.sales];
          else return res.sales;
        });
      } else {
        // Replace the existing list of transactions with the new one
        setTransactions(res.sales);
      }
      // If there is a new page key, update the state variable
      if (res.pageKey && res.pageKey.length != pagekey) {
        setPageKey(res.pageKey);
      } else {
        setPageKey(null);
      }
    } else {
      // If no data is received, set state variables to null
      setPageKey();
      setTransactions();
    }
  };
  return (
    <div className="flex flex-col items-center justify-between p-6">
      <Toaster position="bottom-left" toastOptions={{ duration: 5000 }} />
      <Header></Header>
      <div className="my-20 w-6/12">
        <Search
          placeholder="Collection's contract address"
          enterButton="Search"
          size="large"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onSearch={onSearch}
        />
      </div>
      <div className="w-9/12">
        <Table
          columns={columns}
          dataSource={transactions}
          pagination={{ pageSize: 20 }}
          bordered
          scroll={{
            y: 600,
          }}
        />
        <button
          className="py-1 px-5 bg-emerald-500 text-white rounded-lg"
          onClick={() => {
            getNftSales(pageKey);
          }}
          disabled={!pageKey || isLoading}
        >
          next
        </button>
      </div>
    </div>
  );
}

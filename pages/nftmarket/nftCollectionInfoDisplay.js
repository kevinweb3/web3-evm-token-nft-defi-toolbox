// import necessary modules
import styles from "/public/styles/NftCollectionInfo.module.css";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import toast, { Toaster } from "react-hot-toast";
import React from "react";
import { Input, Select, Space } from "antd";

// define component function that receives collectionAddress prop
export default function NFTCollectionInfo() {
  // initialize state for loading state and collection data
  const [isLoading, setIsLoading] = useState(false);
  const [collection, setCollection] = useState();
  const [collectionAddress, setCollectionAddress] = useState(
    "0x8D9710f0e193d3f95c0723eAAF1A81030Dc9116D"
  );

  const nftAddresses = [
    "0x769272677faB02575E84945F03Eca517ACc544Cc",
    "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    "0x8D9710f0e193d3f95c0723eAAF1A81030Dc9116D",
    "0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B",
    "0xB9951B43802dCF3ef5b14567cb17adF367ed1c0F",
    "0x8821BeE2ba0dF28761AffF119D66390D594CD280",
    "0x99a9B7c1116f9ceEB1652de04d5969CcE509B069",
    "0x059EDD72Cd353dF5106D2B9cC5ab83a52287aC3a",
    "0xc143bbfcDBdBEd6d454803804752a064A622C1F3",
    "0x76BE3b62873462d2142405439777e971754E8E77",
    "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    "0x5C1A0CC6DAdf4d0fB31425461df35Ba80fCBc110",
    "0x23581767a106ae21c074b2276D25e5C3e136a68b",
    "0xE012Baf811CF9c05c408e879C399960D1f305903",
    "0x79FCDEF22feeD20eDDacbB2587640e45491b757f",
    "0x08D7C0242953446436F34b4C78Fe9da38c73668d",
    "0x0Fc3DD8C37880a297166BEd57759974A157f0E74",
    "0x39ee2c7b3cb80254225884ca001F57118C8f21B6",
    "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
  ];

  // define async function to fetch collection data
  const getCollection = async () => {
    setIsLoading(true);
    // make POST request to server to fetch collection metadata
    const fetchdata = await fetch("/api/nft/getNftContractMetadata", {
      method: "POST",
      body: JSON.stringify({
        // pass the collectionAddress prop as a parameter
        address: collectionAddress,
      }),
    }).then((data) => data.json());
    setCollection(fetchdata);
    setIsLoading(false);
  };

  const { Search } = Input;

  const onSearch = (value, _e, info) => {
    getCollection();
  };

  const onChange = (value) => {
    setCollectionAddress(value);
    getCollection();
  };

  // useEffect hook to fetch collection data when component mounts
  useEffect(() => {
    getCollection();
  }, []);

  // if loading state is true, display a loading message

  // render the collection data
  return (
    <div className="flex flex-col items-center justify-between p-6">
      <Toaster position="bottom-left" toastOptions={{ duration: 5000 }} />
      <Header></Header>
      <div className="my-10 py-10 flex flex-col w-8/12">
        <div className="my-10 w-full flex justify-between">
          <Search
            placeholder="Collection's contract address"
            enterButton="Search"
            style={{
              width: 400,
            }}
            size="large"
            value={collectionAddress}
            onChange={(e) => setCollectionAddress(e.target.value)}
            onSearch={onSearch}
          />

          <Select
            defaultValue="TOPIA Worlds"
            size="large"
            style={{
              width: 400,
            }}
            allowClear
            onChange={onChange}
            options={[
              {
                value: "0x769272677faB02575E84945F03Eca517ACc544Cc",
                label: "The Captainz",
              },
              {
                value: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
                label: "Bored Ape Yacht Club",
              },
              {
                value: "0x8D9710f0e193d3f95c0723eAAF1A81030Dc9116D",
                label: "TOPIA Worlds",
              },
              {
                value: "0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B",
                label: "CLONE X - X TAKASHI MURAKAMI",
              },
              {
                value: "0xB9951B43802dCF3ef5b14567cb17adF367ed1c0F",
                label: "Neo Tokyo Citizens",
              },
              {
                value: "0x8821BeE2ba0dF28761AffF119D66390D594CD280",
                label: "DeGods",
              },
              {
                value: "0x99a9B7c1116f9ceEB1652de04d5969CcE509B069",
                label: "Art Blocks",
              },
              {
                value: "0xc143bbfcDBdBEd6d454803804752a064A622C1F3",
                label: "Async Blueprints",
              },
              {
                value: "0x76BE3b62873462d2142405439777e971754E8E77",
                label: "Parallel Alpha",
              },
              {
                value: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
                label: "Doodles",
              },
              {
                value: "0x5C1A0CC6DAdf4d0fB31425461df35Ba80fCBc110",
                label: "Pixels - Farm Land",
              },
              {
                value: "0x23581767a106ae21c074b2276D25e5C3e136a68b",
                label: "Moonbirds",
              },
              {
                value: "0xE012Baf811CF9c05c408e879C399960D1f305903",
                label: "Otherside Koda",
              },
              {
                value: "0x79FCDEF22feeD20eDDacbB2587640e45491b757f",
                label: "mfers",
              },
              {
                value: "0x08D7C0242953446436F34b4C78Fe9da38c73668d",
                label: "PROOF Collective",
              },
              {
                value: "0x0Fc3DD8C37880a297166BEd57759974A157f0E74",
                label: "Parallel Avatars",
              },
              {
                value: "0x39ee2c7b3cb80254225884ca001F57118C8f21B6",
                label: "The Potatoz",
              },
              {
                value: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
                label: "Mutant Ape Yacht Club",
              },
            ]}
          />
        </div>
        <div className="flex flex-col py-5 px-10 border-blue-600 border border-dashed rounded-md">
          <div className={styles.header}>
            <img src={collection?.imageUrl} className={styles.image}></img>
            <div className="px-5">
              <h2 className={styles.collection_name}>
                {collection?.name}
                {collection?.verified ? (
                  <img
                    className={styles.verified_icon}
                    src={
                      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/2048px-Twitter_Verified_Badge.svg.png"
                    }
                  />
                ) : null}
              </h2>
              <h4 className={styles.company_name}>{collection?.symbol}</h4>
            </div>
            <div className={styles.socials_container}>
              {collection?.twitter_username /* if the collection has a Twitter username, display a Twitter icon linking to the Twitter page */ ? (
                <a
                  href={"https://twitter.com/" + collection?.twitter_username}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={
                      "https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
                    }
                    alt="t"
                    className={styles.twitter_icon}
                  />
                </a>
              ) : null}
              {collection?.discord_url /* if the collection has a Discord URL, display a Discord icon linking to the Discord page */ ? (
                <a
                  href={collection?.discord_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={
                      "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"
                    }
                    alt="d"
                    className={styles.discord_icon}
                  />
                </a>
              ) : null}
            </div>
          </div>
          <div className={styles.description}>
            {collection?.description.split("\n").map((item, key) => {
              // display the collection description, parsing any URLs as clickable links
              const regex = /(https?:\/\/[^\s]+)/g;
              if (regex.test(item)) {
                return (
                  <p key={key}>
                    {item.split(regex).map((text, index) => {
                      if (regex.test(text)) {
                        return (
                          <a
                            className={styles.link}
                            href={text}
                            key={index}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {text}
                          </a>
                        );
                      } else return <>{text}</>;
                    })}
                    <br />
                  </p>
                );
              } else {
                return (
                  <p key={key}>
                    {item}
                    <br />
                  </p>
                );
              }
            })}
          </div>
          <div className={styles.data_container}>
            <div className={styles.data_point_container}>
              <h3 className={styles.data_title}>FLOOR</h3>
              <h1 className={styles.data_point}>
                {collection?.floorPrice} ETH
              </h1>
            </div>
            <div className={styles.data_point_container}>
              <h3 className={styles.data_title}>TOTAL SUPPLY</h3>
              <h1 className={styles.data_point}>{collection?.totalSupply}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

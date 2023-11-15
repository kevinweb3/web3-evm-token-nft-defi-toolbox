import React, { useState, useEffect } from 'react';
import {
	useAccount,
	useContractWrite,
	usePrepareContractWrite,
	useWaitForTransaction,
	useNetwork,
} from 'wagmi';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import { Inter } from 'next/font/google';
import { Input, Form, message, Space, Button } from 'antd';

const inter = Inter({ subsets: ['latin'] });

function MintNFT() {
  const [tokenId, setTokenId] = React.useState('');
  // const debouncedTokenId = useDebounce(tokenId)

	const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    abi: [
      {
        name: 'mint',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ internalType: 'uint32', name: 'tokenId', type: 'uint32' }],
        outputs: [],
      },
    ],
    functionName: 'mint',
    args: [parseInt(tokenId)],
    enabled: Boolean(tokenId),
	});

	const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const [form] = Form.useForm();
  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  return (
    <div>
       <Form
            form={form}
            layout="vertical"
            onFinish={(e) => {
					    write?.();
            }}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className='my-10'>
              <Form.Item
                name="tokenId"
                label="Token ID"
                rules={[{ required: true }]}
              >
                <Input
                  size="large"
                  id="tokenId"
                  value={tokenId}
                  required
                  placeholder="420"
                  onChange={(e) => setTokenId(e.target.value)}
                   />
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Space>
                  <Button
                    className='bg-[#1677ff]'
                    type="primary"
                    size="large"
                    disabled={!write || isLoading}
                    htmlType="submit">
                   			{isLoading ? 'Minting...' : 'Mint'}
                  </Button>
                </Space>
              </Form.Item>
            </div>
        </Form>
          {isSuccess && (
                <div>
                  Successfully minted your NFT!
                  <div>
                    <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
                  </div>
                </div>
              )}
              {(isPrepareError || isError) && (
                <div>Error: {(prepareError || error)?.message}</div>
              )}
    </div>
  )
}

export default function MintNFTExample() {
	const { isConnected } = useAccount();
	return (
		<div>
			<main className={`flex flex-col items-center justify-between p-6 ${inter.className}`}>
      <Toaster position='bottom-left' toastOptions={{ duration: 5000 }} />
      <Header></Header>
      <section className='grid text-center lg:max-w-6xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left my-40'>
        <div className='text-4xl font-bold my-8'>
        Mint NFT
        </div>
        <div className='text-lg'>
        mint a non-fungible token (NFT) using wagmi useContractWrite and usePrepareContractWrite Hooks. NFTs are unique digital assets that can represent things like artwork, collectibles, and other unique items. Connect to Polygon Mumbai to Mint a NFT.
        </div>
        {isConnected ? (
          <MintNFT />
        ) : (
          <div
            className={`${inter.className} w-full max-w-3xl text-[16px] pt-8 leading-7 break-all`}
          >
            <b className='text-lg text-red-500'>Please Connect Your Wallet at First!</b>
          </div>
        )}
      </section>
      </main>
		</div>
	);
}

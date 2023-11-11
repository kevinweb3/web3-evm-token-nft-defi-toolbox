import React, { useState } from 'react';
import { fetchEnsAddress, fetchEnsName } from '@wagmi/core';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import { Inter } from 'next/font/google';
import { Input, Form, message, Space, Button } from 'antd';
import { useDebounce } from 'use-debounce';
import {
	useNetwork,
	useAccount,
	useBalance,
	useContractWrite,
	usePrepareContractWrite,
	useWaitForTransaction,
	erc20ABI,
} from 'wagmi';
import { parseEther } from 'viem';

const inter = Inter({ subsets: ['latin'] });

export default function Senderc20() {
  const { isConnected } = useAccount();
  const [tokenContract, setTokenContract] = useState('');
	const debouncedTokenContract = useDebounce(tokenContract, 500);

	const [to, setTo] = useState('');
	const debouncedTo = useDebounce(to, 500);

	const [amount, setAmount] = useState<string>('');
	const debouncedAmount = useDebounce(amount, 500);

	const { chain } = useNetwork();
	const { address } = useAccount();
	const balance = useBalance({
		address,
		token: debouncedTokenContract[0] as `0x{string}`,
	});

	const prepareContractWrite = usePrepareContractWrite({
		address: debouncedTokenContract[0] as `0x{string}`,
		abi: erc20ABI,
		chainId: chain?.id,
		functionName: 'transfer',
		args: [
			(debouncedTo[0] as `0x{string}`) ?? '0x0',
			debouncedAmount[0]
				? parseEther(debouncedAmount[0] as `${number}`)
				: parseEther('0'),
		],
	});
	const contractWrite = useContractWrite({
		...prepareContractWrite.config,
		onError() {
			toast.error('User denied transaction');
		},
	});
	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash,
		onSettled() {
			balance.refetch();
		},
	});

  const [form] = Form.useForm();
  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  return (
		<main className={`flex flex-col items-center justify-between p-6 ${inter.className}`}>
      <Toaster position='bottom-left' toastOptions={{ duration: 5000 }} />
      <Header></Header>
      <div className='grid text-center lg:max-w-6xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left my-40'>
        <div className='text-4xl font-bold my-8'>
        Send ERC-20 Token
        </div>
        <div className='text-lg'>
        send an ERC20 token from one Ethereum address to another. ERC20 is a standard for fungible tokens on the Ethereum network. The example includes a tutorial on how to interact with a deployed ERC20 token contract.
        </div>
        {isConnected ? (
          <div>
             <Form
            form={form}
            layout="vertical"
            onFinish={(e) => {
              contractWrite.writeAsync?.();
            }}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className='my-10'>
              <Form.Item
                name="tokenAddress"
                label="Token Address"
                rules={[{ required: true }]}
              >
                <Input
                  size="large"
                  value={tokenContract}
                  required
                  placeholder="Token Address"
                  onChange={(e) => setTokenContract(e.target.value)}
                   />
              </Form.Item>
            </div>
            <div className='my-10'>
              <Form.Item
                name="recipient"
                label="Rcipient Address"
                rules={[{ required: true }]}
              >
                <Input
                  size="large"
                  value={amount}
                  required
                  placeholder="1 Ether"
                  onChange={(e) => setTo(e.target.value)}
                   />
              </Form.Item>
            </div>
            <div className='my-10'>
              <Form.Item
                name="Amount"
                label="Amount"
                rules={[{ required: true }]}
              >
                <Input
                  size="large"
                  required
                  value={amount}
                  placeholder="1 Ether"
                  onChange={(e) => setAmount(e.target.value)}
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
                    disabled={
                      !contractWrite.writeAsync ||
                      waitForTransaction.isLoading ||
                      !to ||
                      !amount
                    }
                    htmlType="submit">
                   			{waitForTransaction.isLoading
                        ? 'Sending...'
                        : contractWrite.isLoading
                        ? 'Check your wallet'
                        : 'Send'}
                  </Button>
                </Space>
              </Form.Item>
            </div>
        </Form>
        {waitForTransaction.isSuccess && (
					<div
						className={`${inter.className} w-full max-w-3xl text-[16px] pt-8 leading-7 break-all`}
					>
						Successfully sent {amount} {balance.data?.symbol} to {to}
						<div>
							View Transaction on{'  '}
							<a
								href={`${chain?.blockExplorers?.default.url}/tx/${contractWrite.data?.hash}`}
								target='_blank'
								rel='noopener noreferrer'
								className='hover:underline text-blue-500'
							>
								Etherscan
							</a>
						</div>
					</div>
				)}
				{waitForTransaction.isError && waitForTransaction.isIdle && (
					<div
						className={`${inter.className} w-full max-w-3xl text-[16px] pt-8 leading-7 break-all`}
					>
						Error sending {amount} {balance.data?.symbol} to {to}
						<div>{waitForTransaction.error?.message}</div>
					</div>
				)}
          </div>
        ) : (
          <div className={`${inter.className} w-full max-w-3xl text-[16px] pt-8 leading-7 break-all`}>
            <b className='text-lg text-red-500'>Please Connect Your Wallet at First!</b>
          </div>
        )}
      </div>
    </main>
  )
}


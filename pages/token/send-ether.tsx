import React, { useState } from 'react';
import { fetchEnsAddress, fetchEnsName } from '@wagmi/core';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import { Inter } from 'next/font/google';
import { Input, Form, message, Space, Button } from 'antd';
import { useDebounce } from 'use-debounce';
import {
	useAccount,
	useBalance,
	useNetwork,
	usePrepareSendTransaction,
	useSendTransaction,
	useWaitForTransaction,
} from 'wagmi';
import { parseEther } from 'viem';

const inter = Inter({ subsets: ['latin'] });

export default function Sendether() {
  const { isConnected } = useAccount();
  const [to, setTo] = useState('');
	const [debouncedTo] = useDebounce(to, 500);

	const [amount, setAmount] = useState('');
	const [debouncedAmount] = useDebounce(amount, 500);

	const { chain } = useNetwork();
	const { address } = useAccount();

	const balance = useBalance({
		address,
	});

  const sendTransaction = useSendTransaction({
		account: address,
		to: debouncedTo,
		value: debouncedAmount
			? parseEther(debouncedAmount as `${number}`)
			: undefined,
		onError() {
			toast.error('User Rejected Transaction');
		},
	});

	const { isLoading, isSuccess, refetch } = useWaitForTransaction({
		hash: sendTransaction.data?.hash,
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
        Send Ether
        </div>
        <div className='text-lg'>
        send a transaction on the Ethereum network using the Wagmi library. It covers the use of the useSendTransaction and usePrepareSendTransaction hooks, which handle the process of sending the transaction and fetching required parameters such as the gas estimate and ENS resolution
        </div>
        {isConnected ? (
          <div>
             <Form
            form={form}
            layout="vertical"
            onFinish={(e) => {
              sendTransaction.sendTransactionAsync();
            }}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className='my-10'>
              <Form.Item
                name="Reciever"
                label="Reciever Address"
                rules={[{ required: true }]}
              >
                <Input
                  size="large"
                  value={to}
                  placeholder="0xA0Cf…251e"
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
                      isLoading ||
                      sendTransaction.isLoading ||
                      !sendTransaction.sendTransaction ||
                      !to ||
                      !amount
                    }
                    htmlType="submit">
                    {isLoading
                      ? 'Sending...'
                      : sendTransaction.isLoading
                      ? 'Check your wallet'
                      : 'Send'}
                  </Button>
                </Space>
              </Form.Item>
            </div>
        </Form>
        {isSuccess && (
          <div
            className={`${inter.className} w-full max-w-3xl text-[16px] pt-8 leading-7 break-all`}>
            Successfully sent {amount} ether to {to}
            <div>
              View Transaction on{'  '}
              <a
                href={`${chain?.blockExplorers?.default.url}/tx/${sendTransaction?.data?.hash}`}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:underline text-blue-500'
              >
                Etherscan
              </a>
            </div>
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


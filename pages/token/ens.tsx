import React, { useState } from 'react';
import { fetchEnsAddress, fetchEnsName } from '@wagmi/core';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import { Inter } from 'next/font/google';
import { Input, Form, message, Space, Button } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';

const inter = Inter({ subsets: ['latin'] });

export default function Ens() {
  const [status, setStatus] = useState<'idle' | 'fetching'>('idle');
	const [input, setInput] = useState('');
	const [resolved, setResolved] = useState('');
  const { isConnected } = useAccount();

  async function submit() {
    message.success('Submit success!');
		try {
			setStatus('fetching');
			if (input.endsWith('.eth')) {
				let resolvedENS = await fetchEnsAddress({
					name: input,
				});
				setResolved(String(resolvedENS));
			} else {
				let resolvedAddress = await fetchEnsName({
					address: input as `0x{string}`,
				});
				setResolved(String(resolvedAddress));
			}
		} catch (error) {
			console.log(error);
		} finally {
			setStatus('idle');
		}
	}

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
        Fetch ENS Names
        </div>
        <div className='text-lg'>
        use the Ethereum Name Service (ENS) to resolve human-readable names to Ethereum addresses. ENS is a decentralized domain name system that allows users to register and map domain names to Ethereum addresses.
        </div>
        {isConnected ? (
          <div>
             <Form
            form={form}
            layout="vertical"
            onFinish={submit}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className='my-10'>
            <Form.Item
                name="ENSName"
                label="ENS Name"
                rules={[{ required: true }]}
              >
                <Input
                  size="large"
                  placeholder="vitalik.eth/0xAb5...C9B"
                  onChange={(e) => setInput(e.target.value)}
                  prefix={<EnvironmentOutlined />} />
            </Form.Item>
            {resolved && (
                <div
                  className={`${inter.className} w-full max-w-3xl text-[16px] pt-8 leading-7 break-all`}
                >
                  <b>Resolved ENS/Address</b>: {resolved}
                </div>
              )}
            </div>
            <div>
            <Form.Item>
              <Space>
                <Button
                className={`${
                  inter.className
                } ${
                  status === 'idle'
                    ? 'bg-[#1677ff]'
                    : 'bg-slate-700'
                }`}
                  type="primary"
                  size="large"
                  disabled={status === 'fetching' ? true : false}
                  htmlType="submit">
                  {status === 'idle' ? 'Fetch' : 'Fetching...'}
                </Button>
              </Space>
            </Form.Item>
            {/* <CustomButton
                type={status === 'idle' ? 'blue' : 'grey'}
                text={status === 'idle' ? 'Fetch' : 'Fetching...'}
                handleClick={submit}
                disabled={status === 'fetching'}
              /> */}
              
            </div>
        </Form>
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


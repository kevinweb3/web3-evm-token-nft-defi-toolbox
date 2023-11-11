import React, { useState, useRef } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { recoverMessageAddress } from 'viem';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import { Inter } from 'next/font/google';
import { Input, Button } from 'antd';

const inter = Inter({ subsets: ['latin'] });
const { TextArea } = Input;

export default function Sgin() {
  const { address } = useAccount();
  const { isConnected } = useAccount();
	const recoveredAddress = React.useRef<string>('');

	const [message, setMessage] = useState<string>(
		`Sign in with your Ethereum account and let's remember our way to learn web3! 🎉🤝`
	);

  const { data, error, isLoading, signMessageAsync, variables } = useSignMessage({
    message,
			async onSuccess(data, variables) {
				const res = await recoverMessageAddress({
					message: variables?.message,
					signature: data,
				});
				recoveredAddress.current = res;
				if (recoveredAddress.current === address) {
					toast.success('Message verified successfully!');
				}
			},
			onError(error) {
				toast.error(error.message);
			},
  })

  const handleSubmit = async () => {
    signMessageAsync();
  }

  return (
		<main className={`flex flex-col items-center justify-between p-6 ${inter.className}`}>
      <Toaster position='bottom-left' toastOptions={{ duration: 5000 }} />
      <Header></Header>
      <div className='grid text-center lg:max-w-6xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left my-40'>
        <div className='text-4xl font-bold my-8'>
        Sign and verify message
        </div>
        <div className='text-lg'>
        Let us integrate wagmi hooks sign in with their Ethereum account, ensuring a secure and decentralized authentication process. To sign a message, the user Ethereum address is used in conjunction with their private key. We generates a unique signature for the message, which can later be verified by ethers. This process ensures that the message origin is authenticated, and the senders identity is confirmed without exposing their private key.
        </div>
        {isConnected ? (
            <div>
              <div className='my-10'>
                  <TextArea
                    rows={4}
                    placeholder={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={6}
                    className='text-base'
                    />
                </div>
                <div>
                  <CustomButton
                    text={isLoading ? 'Check Wallet' : 'Sign Message'}
                    type={isLoading ? 'grey' : 'blue'}
                    handleClick={handleSubmit}
                  />
                  {data && recoveredAddress.current !== '' && (
                    <div
                      className={`${inter.className} w-full max-w-3xl text-[16px] pt-8 leading-7 break-all`}
                    >
                      <b>Recovered Address</b>: {recoveredAddress.current}
                      <br />
                      <b>Signature</b>: {data}
                    </div>
                  )}
                </div>
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


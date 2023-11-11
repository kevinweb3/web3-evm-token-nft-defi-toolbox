import React, { useState, useEffect } from 'react';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import { Inter } from 'next/font/google';
import { SiweMessage } from 'siwe';
import { SITE_NAME } from '@/utils/config';

const inter = Inter({ subsets: ['latin'] });

export default function Siwe() {
  const [loggedInAddress, setLoggedInAddress] = useState<string>('');
	const { address } = useAccount();
	const { isConnected } = useAccount();
	const { chain } = useNetwork();
	const { signMessageAsync } = useSignMessage();

  useEffect(() => {
		const handler = async () => {
			try {
				const res = await fetch('/api/siwe/me');
				const json = await res.json();
				if (json.address) {
					setLoggedInAddress(json.address);
				}
			} catch (_error) {}
		};

		// Firstly when page loads
		handler();

		// Again if user logs out of another tab
		window.addEventListener('focus', handler);
		return () => window.removeEventListener('focus', handler);
	}, []);

  const signIn = async () => {
		try {
			const chainId = chain?.id;
			if (!address || !chainId) {
				toast.error('Please connect your wallet');
				throw new Error('Please connect your wallet');
			}

			// Step 1: Get Random nonce
			const nonceRes = await fetch('/api/siwe/nonce');
			const nonce = await nonceRes.text();

			// Step 2: Create SIWE Message
			const message = new SiweMessage({
				domain: window.location.host,
				address,
				statement: `Sign in with Ethereum to ${SITE_NAME}.`,
				uri: window.location.origin,
				version: '1',
				chainId,
				nonce: nonce,
			});

			// Step 3: Sign Message
			const signature = await signMessageAsync({
				message: message.prepareMessage(),
			});

			// Step 4: Send Signature to Backend for Verification
			const verifyRes = await fetch('/api/siwe/verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message, signature }),
			});

			if (!verifyRes.ok) {
				toast.error('Error verifying message');
				throw new Error('Error verifying message');
			} else {
				toast.success('Successfully verified message');
				setLoggedInAddress(address);
			}
		} catch (error) {
			console.error(error);
			setLoggedInAddress('');
		}
	};

	const logout = async () => {
		await fetch('/api/siwe/logout');
		setLoggedInAddress('');
	};

  return (
		<main className={`flex flex-col items-center justify-between p-6 ${inter.className}`}>
      <Toaster position='bottom-left' toastOptions={{ duration: 5000 }} />
      <Header></Header>
      <div className='grid text-center lg:max-w-6xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left my-40'>
        <div className='text-4xl font-bold my-8'>
        Sign-in your own any website with Ethereum
        </div>
        <div className='text-lg'>
        Sign-In with Ethereum (SIWE) is a robust authentication standard (EIP-4361) that allows for secure communication between a frontend and backend. By leveraging Ethereum accounts, SIWE provides a powerful method for creating user sessions based on wallet connections, enabling seamless and secure access to blockchain-based applications. Additionally, SIWE offers a range of other benefits, including enhanced security, privacy, and decentralization. With SIWE, developers can build applications that prioritize user control and security, while also benefiting from the efficiency and convenience of a standardized authentication method
        </div>
				{isConnected ? (
					<div>
					<CustomButton text='Sign In' type='blue' handleClick={signIn} />
	
						{loggedInAddress && address && (
							<CustomButton text='Logout' type='red' handleClick={logout} />
						)}
							{loggedInAddress && address && (
						<div
							className={`${inter.className} w-full max-w-3xl text-[16px] pt-8 leading-7 break-all`}
						>
							<b>Login Address</b>: {loggedInAddress}
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


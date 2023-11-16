import Image from 'next/image'
import { Inter } from 'next/font/google';
import Link from 'next/link';
import '@rainbow-me/rainbowkit/styles.css';
import Header from './components/Header';
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] });

export default function Home() {

	const links = [
		{
			title: 'Sign and Verify Message',
			description:
				'Sign in with your Ethereum account to securely verify your identity and access exclusive blockchain-based features.',
			href: '/token/sign',
			icon: '/images/01.png'
		},
		{
			title: 'Sign-in with Ethereum',
			description: 'Experience the power of secure communication with Sign-In with Ethereum (SIWE)!',
			href: '/token/siwe',
			icon: '/images/02.png'
		},
		{
			title: 'Fetch ENS Names',
			description:
				'Fetch Ethereum Name Service names to Ethereum addresses using a decentralized domain name system.',
			href: '/token/ens',
			icon: '/images/03.png'
		},
		{
			title: 'Send Ether',
			description:
				'Send ether to another Ethereum address with a basic transaction.',
			href: '/token/send-ether',
			icon: '/images/04.png'
		},
		{
			title: 'Send ERC20',
			description:
				'ERC20 is a standard for fungible tokens on the Ethereum network. interact with a deployed ERC20 token contract.',
			href: '/token/send-erc20',
			icon: '/images/05.png'
		},
		{
			title: 'Mint NFT',
			description:
				'NFTs are unique digital assets that can represent things like artwork, collectibles, and other unique items.',
			href: '/token/mint-nft',
			icon: '/images/06.png'
		},
		{
			title: 'NFT Creator',
			description:
				'NFTs are unique digital assets that can represent things like artwork, collectibles, and other unique items.',
			href: '/nftmarket/nftCreator',
			icon: '/images/07.png'
		},
		{
			title: 'NFT Gallery',
			description:
				'NFTs are unique digital assets that can represent things like artwork, collectibles, and other unique items.',
			href: '/nftmarket/nftGallery',
			icon: '/images/02.png'
		},
		{
			title: 'NFT Collection Detail',
			description:
				'NFTs are unique digital assets that can represent things like artwork, collectibles, and other unique items.',
			href: '/nftmarket/nftCollectionInfoDisplay',
			icon: '/images/08.png'
		},
		{
			title: 'NFT Collection Sales',
			description:
				'NFTs are unique digital assets that can represent things like artwork, collectibles, and other unique items.',
			href: '/nftmarket/nftCollectionSalesDisplay',
			icon: '/images/04.png'
		},
		{
			title: 'NFT Balance',
			description:
				'NFTs are unique digital assets that can represent things like artwork, collectibles, and other unique items.',
			href: '/nftmarket/tokensBalanceDisplay',
			icon: '/images/01.png'
		},
		{
			title: 'NFT Transction History',
			description:
				'NFTs are unique digital assets that can represent things like artwork, collectibles, and other unique items.',
			href: '/nftmarket/transactionsHistoryDisplay',
			icon: '/images/09.png'
		},
	];
  return (
    <main className={`flex flex-col items-center justify-between p-6 ${inter.className}`}>
			<Head>
        <title>Web3 Develop ToolBox</title>
      </Head>
			<Header></Header>
			<div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full text-4xl font-bold py-20">
				Make Web3 Develop ToolBox
      </div>

      <div className="grid text-center lg:max-w-8xl lg:grid-cols-3 lg:text-left mb-40">
			{links.map((link, index) => (
				  <a
          href={link.href}
					key={index}
          className="grid grid-flow-col auto-cols-max group rounded-xl border bg-gray-40 px-5 py-6 transition-colors hover:border-blue-600 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 my-6 mx-5"
          target="_blank"
          rel="noopener noreferrer"
        >
					<Image
              src={link.icon}
              alt="token Logo"
              className="dark:invert"
              width={48}
              height={48}
              priority
            />
					<div className='col-span-2 px-5'>
							<h2 className={`mb-3 text-xl font-semibold`}>
							{link.title}{' '}
							<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
							</span>
						</h2>
						<p className={`m-0 max-w-[30ch] text-sm opacity-60`}>
						{link.description}
						</p>
					</div>
        </a>
			))}
      </div>
    </main>
  )
}

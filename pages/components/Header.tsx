import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useRouter } from 'next/navigation';

const items: MenuProps['items'] = [
  {
    label: 'Home',
    key: 'home',
  },
  {
    label: 'Token',
    key: 'token',
    children: [
      {
        label: 'Sign Message',
        key: ' /token/sign',
      },
      {
        label: 'Sign In With ETH',
        key: '/token/siwe',
      },
      {
        label: 'Fetch ENS Names',
        key: '/token/ens',
      },
      {
        label: 'Send Ether',
        key: '/token/send-ether',
      },
      {
        label: 'Send ERC20',
        key: '/token/send-erc20',
      },
      {
        label: 'Mint NFT',
        key: '/token/mint-nft',
      },
    ],
  },
  {
    label: 'NFT',
    key: 'nft',
    children: [
      {
        label: 'Item 1',
        key: 's8',
      },
      {
        label: 'Item 2',
        key: 's9',
      },
    ],
  },
  {
    label: 'DeFi',
    key: 'defi',
    children: [
      {
        label: 'Item 1',
        key: 's10',
      },
      {
        label: 'Item 2',
        key: 's11',
      },
    ],
  },
  {
    label: 'BTC',
    key: 'btc',
    children: [
      {
        label: 'Item 1',
        key: 's6',
      },
      {
        label: 'Item 2',
        key: 's7',
      },
    ],
  },
  {
    label: 'EVM',
    key: 'evm',
    children: [
      {
        label: 'Item 1',
        key: 's4',
      },
      {
        label: 'Item 2',
        key: 's5',
      },
    ],
  },
  {
    label: 'Solana',
    key: 'solana',
    children: [
      {
        label: 'Item 1',
        key: 's6',
      },
      {
        label: 'Item 2',
        key: 's7',
      },
    ],
  },
  {
    label: 'Subgraphs',
    key: 'subgraphs',
    children: [
      {
        label: 'Item 1',
        key: 's6',
      },
      {
        label: 'Item 2',
        key: 's7',
      },
    ],
  },
  {
    label: 'Dune',
    key: 'dune',
    children: [
      {
        label: 'Item 1',
        key: 's6',
      },
      {
        label: 'Item 2',
        key: 's7',
      },
    ],
  },
];

export default function Header() {
  const [current, setCurrent] = useState('');
  const router = useRouter();
  console.log(sessionStorage.getItem('menuActive'), 999);
  if (!sessionStorage.getItem('menuActive')) {
    sessionStorage.setItem('menuActive', 'home');
    setCurrent('home');
  }

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    sessionStorage.setItem('menuActive', e.keyPath[1]);
    if (e.key === 'home') {
      router.push('/');
    } else {
      router.push(e.key);
    }
  };
  return (
    <div className="z-10 max-w-7xl w-full items-center justify-between font-mono text-sm lg:flex flex">
     
    <div className="top-0 left-0 flex h-48 items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
      <Link
        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
        href="/"
        target="_self"
        rel="noopener noreferrer"
      >
        <Image
          src="/images/logo.png"
          alt="logo"
          className="dark:invert"
          width={80}
          height={80}
          priority
        />
      </Link>
    </div>
    <div className='flex-1 max-w-4xl ml-20'>
    <Menu style={{ minWidth: 0, flex: "auto", fontSize: "18px" }} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    </div>
    <div className='bottom-0 left-0 items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black static h-auto w-auto lg:bg-none my-24 lg:my-0'>
      <ConnectButton />
    </div>
  </div>
  )
}

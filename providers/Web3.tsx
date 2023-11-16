/* eslint-disable react/no-children-prop */
import '@rainbow-me/rainbowkit/styles.css';
import {
	connectorsForWallets,
	RainbowKitProvider,
	lightTheme,
	darkTheme,
} from '@rainbow-me/rainbowkit';
import {
	injectedWallet,
	metaMaskWallet,
	rainbowWallet,
	trustWallet,
	walletConnectWallet,
	braveWallet,
	coinbaseWallet,
	ledgerWallet,
	argentWallet,
	imTokenWallet,
	omniWallet,
	uniswapWallet,
	okxWallet,
	safeWallet
} from '@rainbow-me/rainbowkit/wallets';

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import { ReactNode } from 'react';

import { ETH_CHAINS, WALLET_CONNECT_PROJECT_ID } from '@/utils/config';

interface Props {
	children: ReactNode;
}

const projectId = WALLET_CONNECT_PROJECT_ID;
const API_KEY: any = process.env.NEXT_PUBLIC_ALCHEMY_Sepolia_API_KEY;

const { chains, publicClient, webSocketPublicClient } = configureChains(
	ETH_CHAINS,
	[publicProvider()]
);

const connectors = connectorsForWallets([
	{
		groupName: 'Recommended',
		wallets: [
			injectedWallet({ chains }),
			metaMaskWallet({ projectId, chains }),
			uniswapWallet({ projectId, chains }),
			coinbaseWallet({ chains, appName: 'DAPP KIT' }),
			rainbowWallet({ projectId, chains }),
			walletConnectWallet({ projectId, chains }),
		],
	},
	{
		groupName: 'Others',
		wallets: [
			trustWallet({ projectId, chains }),
			braveWallet({ chains }),
			ledgerWallet({ projectId, chains }),
			argentWallet({ projectId, chains }),
			imTokenWallet({ projectId, chains }),
			omniWallet({ projectId, chains }),
			okxWallet({ projectId, chains }),
			safeWallet({ chains }),
		],
	},
]);

const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
	webSocketPublicClient,
});

const Web3Provider = (props: Props) => {
	return (
		<WagmiConfig config={wagmiConfig}>
			<RainbowKitProvider
				chains={chains}
				locale="en-US"
				theme={{
					lightMode: lightTheme({ overlayBlur: 'small' }),
					darkMode: darkTheme({ overlayBlur: 'small' }),
				}}
				appInfo={{
					appName: 'Blockchain Toolbox',
					learnMoreUrl: 'https://github.com/kevinweb3',
				}}
			>
				{props.children}
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default Web3Provider;

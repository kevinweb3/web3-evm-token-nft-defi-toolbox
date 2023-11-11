import type { AppProps } from 'next/app';
import Web3Provider from '@/providers/Web3';

import '@/public/globals.css';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
	// 处理组件渲染之前DOM加载引起的错误
	const [showChild, setShowChild] = useState(false);
	useEffect(() => {
		setShowChild(true)
	}, [])

	if (!showChild) {
		return null;
	}	

	return (
		<Web3Provider>
			<Component {...pageProps} />
		</Web3Provider>
	);
}

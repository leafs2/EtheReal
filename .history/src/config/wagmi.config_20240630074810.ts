import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { optimismSepolia, sepolia } from 'wagmi/chains';

const walletConnectProjectId: string = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';
const providerKey: string = process.env.NEXT_PUBLIC_ALCHEMY_ID || '';

export const config = getDefaultConfig({
  transports: {
    [optimismSepolia.id]: http(providerKey),
  },
    appName: 'EtheReal',
    projectId: '330c035d80580970f3b5d53256331d89',
    chains: [optimismSepolia],
    ssr: true,
  });

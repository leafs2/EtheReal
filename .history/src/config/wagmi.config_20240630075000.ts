import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { optimismSepolia } from 'wagmi/chains';

const walletConnectProjectId: string = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '330c035d80580970f3b5d53256331d89';
const providerKey: string = process.env.NEXT_PUBLIC_ALCHEMY_ID || '9t2vpds55mnzx1ae';

export const config = getDefaultConfig({
  transports: {
    [optimismSepolia.id]: http(providerKey),
  },
  appName: 'My-first-dapp',
  projectId: walletConnectProjectId,
  chains: [optimismSepolia],
  ssr: true,
});

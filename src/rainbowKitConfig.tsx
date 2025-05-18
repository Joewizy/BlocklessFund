"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { baseSepolia } from "viem/chains"

export default getDefaultConfig({
    appName: "BlocklessFund",
    projectId: import.meta.env.VITE_API_WALLET_CONNECT_ID as string, 
    chains: [ baseSepolia ],
    ssr: false
})

"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { toast } from "sonner"

interface WalletContextType {
  isConnected: boolean
  principal: string | null
  balance: string
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | null>(null)

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [principal, setPrincipal] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.00")

  useEffect(() => {
    // Check if wallet is already connected
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ic?.plug?.isConnected) {
        const connected = await (window as any).ic.plug.isConnected()
        if (connected) {
          const principalId = await (window as any).ic.plug.agent.getPrincipal()
          const balance = await (window as any).ic.plug.requestBalance()

          setIsConnected(true)
          setPrincipal(principalId.toString())
          setBalance((balance[0]?.amount / 100000000 || 0).toFixed(2))
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error)
    }
  }

  const connect = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ic?.plug) {
        const connected = await (window as any).ic.plug.requestConnect({
          whitelist: [process.env.NEXT_PUBLIC_CANISTER_ID!],
          host: process.env.NODE_ENV === "production" ? "https://mainnet.dfinity.network" : "http://localhost:8000",
        })

        if (connected) {
          const principalId = await (window as any).ic.plug.agent.getPrincipal()
          const balance = await (window as any).ic.plug.requestBalance()

          setIsConnected(true)
          setPrincipal(principalId.toString())
          setBalance((balance[0]?.amount / 100000000 || 0).toFixed(2))
          toast.success("Wallet connected successfully!")
        }
      } else {
        toast.error("Please install Plug Wallet extension")
        window.open("https://plugwallet.ooo/", "_blank")
      }
    } catch (error) {
      toast.error("Failed to connect wallet")
      console.error("Wallet connection error:", error)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setPrincipal(null)
    setBalance("0.00")
    toast.success("Wallet disconnected")
  }

  const value = {
    isConnected,
    principal,
    balance,
    connect,
    disconnect,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, Wallet, User, LogOut, Trophy } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isConnected, connect, disconnect, principal, balance } = useWallet()

  const truncateAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MintMyMoment</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">
              Marketplace
            </Link>
            <Link href="/mint" className="text-gray-300 hover:text-white transition-colors">
              Mint NFT
            </Link>
            {isConnected && (
              <Link href="/my-nfts" className="text-gray-300 hover:text-white transition-colors">
                My NFTs
              </Link>
            )}
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {!isConnected ? (
              <Button onClick={connect} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 bg-transparent">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>{truncateAddress(principal || "")}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
                  <div className="px-3 py-2">
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="text-lg font-semibold text-white">{balance} ICP</p>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem asChild>
                    <Link href="/my-nfts" className="flex items-center text-gray-300 hover:text-white">
                      <User className="w-4 h-4 mr-2" />
                      My NFTs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    onClick={disconnect}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/marketplace"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/mint"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Mint NFT
              </Link>
              {isConnected && (
                <Link
                  href="/my-nfts"
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My NFTs
                </Link>
              )}

              <div className="pt-4 border-t border-gray-800">
                {!isConnected ? (
                  <Button onClick={connect} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Connected:</span>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        {truncateAddress(principal || "")}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Balance:</span>
                      <span className="text-white font-semibold">{balance} ICP</span>
                    </div>
                    <Button
                      onClick={disconnect}
                      variant="outline"
                      className="w-full border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

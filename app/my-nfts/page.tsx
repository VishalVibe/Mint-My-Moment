"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, Calendar, Trophy, User, Loader2 } from "lucide-react"
import Image from "next/image"
import { useNFTContract } from "@/hooks/use-nft-contract"
import { useWallet } from "@/hooks/use-wallet"
import { toast } from "sonner"

export default function MyNFTsPage() {
  const { getUserNFTs, transferNFT, isLoading } = useNFTContract()
  const { isConnected, connect, principal } = useWallet()
  const [myNfts, setMyNfts] = useState<any[]>([])
  const [transferAddress, setTransferAddress] = useState("")
  const [selectedNFT, setSelectedNFT] = useState<any>(null)
  const [isTransferring, setIsTransferring] = useState(false)

  useEffect(() => {
    if (isConnected && principal) {
      loadMyNFTs()
    }
  }, [isConnected, principal])

  const loadMyNFTs = async () => {
    try {
      const nfts = await getUserNFTs(principal!)
      setMyNfts(nfts)
    } catch (error) {
      console.error("Error loading user NFTs:", error)
      toast.error("Failed to load your NFTs")
    }
  }

  const handleTransfer = async () => {
    if (!selectedNFT || !transferAddress) {
      toast.error("Please enter a valid address")
      return
    }

    setIsTransferring(true)
    try {
      await transferNFT(selectedNFT.id, transferAddress)
      toast.success("NFT transferred successfully!")
      setTransferAddress("")
      setSelectedNFT(null)
      loadMyNFTs() // Reload NFTs
    } catch (error) {
      toast.error("Failed to transfer NFT")
      console.error("Transfer error:", error)
    } finally {
      setIsTransferring(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">Connect your Plug Wallet to view your NFT collection.</p>
            <Button onClick={connect} className="w-full bg-blue-600 hover:bg-blue-700">
              Connect Plug Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">My NFT Collection</h1>
          <p className="text-gray-400 text-lg">Your collection of iconic sports moments • {myNfts.length} NFTs owned</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-gray-800/50 border-gray-700 animate-pulse">
                <CardContent className="p-0">
                  <div className="h-64 bg-gray-700 rounded-t-lg" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-700 rounded" />
                    <div className="h-3 bg-gray-700 rounded w-2/3" />
                    <div className="h-8 bg-gray-700 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : myNfts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No NFTs Yet</h3>
            <p className="text-gray-400 mb-6">Start building your collection by minting or buying NFTs</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <a href="/mint">Mint Your First NFT</a>
              </Button>
              <Button variant="outline" asChild className="border-gray-600 text-gray-300 bg-transparent">
                <a href="/marketplace">Browse Marketplace</a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myNfts.map((nft) => (
              <Card
                key={nft.id}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={nft.imageUrl || "/placeholder.svg?height=300&width=300&query=sports+moment"}
                      alt={nft.title}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-blue-600/90 text-white">{nft.sport}</Badge>
                    <Badge className="absolute top-4 right-4 bg-green-600/90 text-white">Owned</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{nft.title}</h3>
                    <p className="text-gray-400 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {nft.playerName}
                    </p>

                    {nft.eventDate && (
                      <div className="flex items-center text-sm text-gray-400 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(nft.eventDate).toLocaleDateString()}
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Minted</p>
                      <p className="text-sm text-gray-300">{new Date(nft.createdAt).toLocaleDateString()}</p>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedNFT(nft)}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Transfer NFT
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Transfer NFT</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg">
                            <Image
                              src={selectedNFT?.imageUrl || "/placeholder.svg?height=60&width=60&query=sports+moment"}
                              alt={selectedNFT?.title || "NFT"}
                              width={60}
                              height={60}
                              className="rounded-lg"
                            />
                            <div>
                              <h4 className="font-semibold text-white">{selectedNFT?.title}</h4>
                              <p className="text-sm text-gray-400">{selectedNFT?.playerName}</p>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="transfer-address" className="text-gray-300">
                              Recipient Address
                            </Label>
                            <Input
                              id="transfer-address"
                              value={transferAddress}
                              onChange={(e) => setTransferAddress(e.target.value)}
                              placeholder="Enter ICP principal ID..."
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>

                          <Button
                            onClick={handleTransfer}
                            disabled={!transferAddress || isTransferring}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            {isTransferring ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Transferring...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Transfer NFT
                              </>
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

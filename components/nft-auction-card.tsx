"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Clock, Gavel, TrendingUp, User } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface AuctionNFT {
  id: string
  title: string
  sport: string
  playerName: string
  imageUrl: string
  currentBid: number
  minBid: number
  endTime: Date
  bidCount: number
  highestBidder: string
  owner: string
}

interface NFTAuctionCardProps {
  nft: AuctionNFT
  onBid: (nftId: string, bidAmount: number) => Promise<void>
  userPrincipal?: string
}

export function NFTAuctionCard({ nft, onBid, userPrincipal }: NFTAuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState("")
  const [bidAmount, setBidAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const endTime = new Date(nft.endTime).getTime()
      const distance = endTime - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`)
        }
      } else {
        setTimeLeft("Auction ended")
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [nft.endTime])

  const handleBid = async () => {
    const bid = Number.parseFloat(bidAmount)
    if (!bid || bid <= nft.currentBid) {
      toast.error(`Bid must be higher than ${nft.currentBid} ICP`)
      return
    }

    if (bid < nft.minBid) {
      toast.error(`Minimum bid is ${nft.minBid} ICP`)
      return
    }

    setIsSubmitting(true)
    try {
      await onBid(nft.id, bid)
      setBidAmount("")
      toast.success("Bid placed successfully!")
    } catch (error) {
      toast.error("Failed to place bid")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isAuctionActive = new Date() < new Date(nft.endTime)
  const isOwner = nft.owner === userPrincipal
  const isHighestBidder = nft.highestBidder === userPrincipal

  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={nft.imageUrl || "/placeholder.svg?height=300&width=300&query=sports+auction"}
            alt={nft.title}
            width={300}
            height={300}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-4 left-4 bg-blue-600/90 text-white">{nft.sport}</Badge>
          {isAuctionActive && (
            <Badge className="absolute top-4 right-4 bg-red-600/90 text-white animate-pulse">
              <Clock className="w-3 h-3 mr-1" />
              Live
            </Badge>
          )}
          {isHighestBidder && (
            <Badge className="absolute bottom-4 right-4 bg-green-600/90 text-white">Highest Bidder</Badge>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{nft.title}</h3>
          <p className="text-gray-400 mb-3 flex items-center">
            <User className="w-4 h-4 mr-1" />
            {nft.playerName}
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Current Bid</span>
              <span className="text-lg font-bold text-blue-400">{nft.currentBid} ICP</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Bids</span>
              <span className="text-sm text-gray-300">{nft.bidCount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Time Left</span>
              <span className={`text-sm font-medium ${isAuctionActive ? "text-red-400" : "text-gray-400"}`}>
                {timeLeft}
              </span>
            </div>
          </div>

          {isOwner ? (
            <Button disabled className="w-full bg-gray-600 text-gray-400">
              You Own This NFT
            </Button>
          ) : !isAuctionActive ? (
            <Button disabled className="w-full bg-gray-600 text-gray-400">
              Auction Ended
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                  <Gavel className="w-4 h-4 mr-2" />
                  Place Bid
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Place Your Bid</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg">
                    <Image
                      src={nft.imageUrl || "/placeholder.svg?height=60&width=60&query=sports+auction"}
                      alt={nft.title}
                      width={60}
                      height={60}
                      className="rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-white">{nft.title}</h4>
                      <p className="text-sm text-gray-400">{nft.playerName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Current Bid:</span>
                      <p className="text-blue-400 font-semibold">{nft.currentBid} ICP</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Minimum Bid:</span>
                      <p className="text-gray-300">{nft.minBid} ICP</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bid-amount" className="text-gray-300">
                      Your Bid (ICP)
                    </Label>
                    <Input
                      id="bid-amount"
                      type="number"
                      step="0.01"
                      min={nft.minBid}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Minimum ${nft.minBid} ICP`}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <Button
                    onClick={handleBid}
                    disabled={!bidAmount || isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    {isSubmitting ? (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2 animate-spin" />
                        Placing Bid...
                      </>
                    ) : (
                      <>
                        <Gavel className="w-4 h-4 mr-2" />
                        Place Bid
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NFTImage } from "@/components/nft-image"
import {
  Heart,
  Share2,
  ExternalLink,
  Calendar,
  User,
  Trophy,
  ShoppingCart,
  Send,
  Copy,
  Eye,
  TrendingUp,
  MapPin,
  Clock,
  Target,
  Award,
  Info,
} from "lucide-react"
import Link from "next/link"
import { useNFTContract } from "@/hooks/use-nft-contract"
import { useWallet } from "@/hooks/use-wallet"
import { toast } from "sonner"

interface NFTMoment {
  date: string
  venue: string
  context: string
  significance: string
  stats: string
  impact: string
}

interface NFTDetails {
  id: string
  title: string
  description: string
  sport: string
  playerName: string
  eventDate: string
  imageUrl: string
  owner: string
  creator: string
  price: string
  createdAt: string
  views: number
  likes: number
  attributes: Array<{ trait_type: string; value: string }>
  moment: NFTMoment
}

// Demo NFT data with real Unsplash images
const demoNFTs: { [key: string]: NFTDetails } = {
  "1": {
    id: "1",
    title: "LeBron's Championship Dunk",
    description:
      "The iconic championship-winning dunk that sealed the Lakers' victory in Game 6 of the 2020 NBA Finals.",
    sport: "Basketball",
    playerName: "LeBron James",
    eventDate: "2020-10-11",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop&crop=center",
    owner: "rrkah-fqaaa-aaaaa-aaaaq-cai",
    creator: "rrkah-fqaaa-aaaaa-aaaaq-cai",
    price: "2.5",
    createdAt: "2024-01-15T10:30:00Z",
    views: 1247,
    likes: 89,
    attributes: [
      { trait_type: "Sport", value: "Basketball" },
      { trait_type: "Player", value: "LeBron James" },
      { trait_type: "Team", value: "Los Angeles Lakers" },
      { trait_type: "Season", value: "2019-20" },
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Event Type", value: "NBA Finals" },
    ],
    moment: {
      date: "October 11, 2020",
      venue: "AdventHealth Arena, Orlando",
      context: "NBA Finals Game 6 - Lakers vs Miami Heat",
      significance:
        "This thunderous dunk with 2:47 remaining in the fourth quarter effectively sealed the Lakers' 17th championship. LeBron drove baseline past Bam Adebayo and threw down a powerful two-handed slam that sent shockwaves through the bubble. The dunk capped off a dominant 28-point, 14-rebound, 10-assist triple-double performance, making LeBron the first player in NBA history to win Finals MVP with three different franchises.",
      stats: "28 PTS, 14 REB, 10 AST, 2 STL",
      impact: "Secured Lakers' first championship in 10 years and LeBron's 4th title",
    },
  },
  "2": {
    id: "2",
    title: "Messi's World Cup Goal",
    description: "The goal that completed Messi's legacy - his first World Cup triumph with Argentina.",
    sport: "Soccer",
    playerName: "Lionel Messi",
    eventDate: "2022-12-18",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=600&fit=crop&crop=center",
    owner: "rdmx6-jaaaa-aaaah-qcaiq-cai",
    creator: "rdmx6-jaaaa-aaaah-qcaiq-cai",
    price: "3.2",
    createdAt: "2024-01-10T14:20:00Z",
    views: 2103,
    likes: 156,
    attributes: [
      { trait_type: "Sport", value: "Soccer" },
      { trait_type: "Player", value: "Lionel Messi" },
      { trait_type: "Team", value: "Argentina" },
      { trait_type: "Tournament", value: "FIFA World Cup" },
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Event Type", value: "World Cup Final" },
    ],
    moment: {
      date: "December 18, 2022",
      venue: "Lusail Stadium, Qatar",
      context: "FIFA World Cup Final - Argentina vs France",
      significance:
        "In the 108th minute of extra time, with the score tied 3-3, Messi pounced on a rebound inside the six-yard box to score what would be the winning goal. This moment completed his legendary career, finally capturing the one trophy that had eluded him. The goal sparked wild celebrations and cemented his status as the greatest player of all time.",
      stats: "2 Goals, 1 Assist, 7 Shots",
      impact: "First World Cup victory, completed career Grand Slam",
    },
  },
  "3": {
    id: "3",
    title: "Nadal's French Open Serve",
    description:
      "The serve that secured Nadal's 14th French Open title, the most dominant performance in tennis history.",
    sport: "Tennis",
    playerName: "Rafael Nadal",
    eventDate: "2022-06-05",
    imageUrl: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=600&fit=crop&crop=center",
    owner: "rno2w-sqaaa-aaaah-qcaiq-cai",
    creator: "rno2w-sqaaa-aaaah-qcaiq-cai",
    price: "1.8",
    createdAt: "2024-01-08T16:45:00Z",
    views: 892,
    likes: 67,
    attributes: [
      { trait_type: "Sport", value: "Tennis" },
      { trait_type: "Player", value: "Rafael Nadal" },
      { trait_type: "Tournament", value: "French Open" },
      { trait_type: "Surface", value: "Clay" },
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Event Type", value: "Grand Slam Final" },
    ],
    moment: {
      date: "June 5, 2022",
      venue: "Court Philippe-Chatrier, Roland Garros",
      context: "French Open Final - Nadal vs Casper Ruud",
      significance:
        "This ace down the T at 125 mph sealed the first set 6-3 and set the tone for Nadal's dominant 6-3, 6-3, 6-0 victory. At age 36, this serve helped secure his 14th French Open title and 22nd Grand Slam, extending his record as the most successful player in tennis history. The serve showcased his incredible longevity and continued dominance on clay courts.",
      stats: "14 Aces, 78% First Serve",
      impact: "14th French Open title, 22nd Grand Slam overall",
    },
  },
}

export default function NFTDetailsPage() {
  const params = useParams()
  const nftId = params.id as string
  const { isConnected, principal } = useWallet()
  const { buyNFT, transferNFT, isLoading } = useNFTContract()

  const [nft, setNft] = useState<NFTDetails | null>(null)
  const [transferAddress, setTransferAddress] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [showMomentDetails, setShowMomentDetails] = useState(false)
  const [priceHistory, setPriceHistory] = useState([
    { date: "2024-01-15", price: 2.1 },
    { date: "2024-01-20", price: 2.3 },
    { date: "2024-01-25", price: 2.5 },
  ])

  useEffect(() => {
    if (nftId) {
      loadNFTDetails()
    }
  }, [nftId])

  const loadNFTDetails = async () => {
    try {
      // Get demo NFT data
      const nftData = demoNFTs[nftId]
      if (nftData) {
        setNft(nftData)
      } else {
        toast.error("NFT not found")
      }
    } catch (error) {
      console.error("Error loading NFT details:", error)
      toast.error("Failed to load NFT details")
    }
  }

  const handleBuy = async () => {
    if (!nft || !isConnected) return

    try {
      await buyNFT(nft.id, nft.price)
      toast.success("NFT purchased successfully!")
      loadNFTDetails() // Reload to update ownership
    } catch (error) {
      toast.error("Failed to purchase NFT")
    }
  }

  const handleTransfer = async () => {
    if (!nft || !transferAddress) return

    try {
      await transferNFT(nft.id, transferAddress)
      toast.success("NFT transferred successfully!")
      setTransferAddress("")
      loadNFTDetails() // Reload to update ownership
    } catch (error) {
      toast.error("Failed to transfer NFT")
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: nft?.title,
        text: `Check out this amazing sports NFT: ${nft?.title}`,
        url: window.location.href,
      })
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.success("Address copied to clipboard!")
  }

  if (!nft) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  const isOwner = nft.owner === principal
  const isCreator = nft.creator === principal

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* NFT Image */}
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <NFTImage
                    src={nft.imageUrl}
                    alt={`${nft.title} - ${nft.playerName} ${nft.sport} moment`}
                    width={600}
                    height={600}
                    className="w-full aspect-square object-cover"
                    priority={true}
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-blue-600/90 text-white">{nft.sport}</Badge>
                    {isCreator && <Badge className="bg-purple-600/90 text-white">Creator</Badge>}
                    {isOwner && <Badge className="bg-green-600/90 text-white">Owned</Badge>}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Moment Details Card */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    The Moment
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMomentDetails(!showMomentDetails)}
                    className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                  >
                    {showMomentDetails ? "Hide Details" : "Show Details"}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white ml-2">{nft.moment.date}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-gray-400">Venue:</span>
                      <span className="text-white ml-2 truncate">{nft.moment.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm">
                    <Trophy className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-gray-400">Context:</span>
                    <span className="text-white ml-2">{nft.moment.context}</span>
                  </div>

                  {showMomentDetails && (
                    <div className="space-y-4 pt-4 border-t border-gray-700">
                      <div>
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <Target className="w-4 h-4 text-purple-400 mr-2" />
                          Significance
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{nft.moment.significance}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <Clock className="w-4 h-4 text-blue-400 mr-2" />
                            Stats
                          </h4>
                          <p className="text-gray-300 text-sm">{nft.moment.stats}</p>
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <Award className="w-4 h-4 text-green-400 mr-2" />
                            Impact
                          </h4>
                          <p className="text-gray-300 text-sm">{nft.moment.impact}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Attributes */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Attributes</h3>
                <div className="grid grid-cols-2 gap-4">
                  {nft.attributes.map((attr, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-400 mb-1">{attr.trait_type}</p>
                      <p className="text-white font-medium">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* NFT Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{nft.title}</h1>
              <p className="text-gray-300 text-lg leading-relaxed">{nft.description}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {nft.views} views
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {nft.likes} likes
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(nft.eventDate).toLocaleDateString()}
              </div>
            </div>

            {/* Price & Actions */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Current Price</p>
                    <p className="text-3xl font-bold text-blue-400">{nft.price} ICP</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-1">USD Value</p>
                    <p className="text-lg text-gray-300">${(Number.parseFloat(nft.price) * 12.5).toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!isOwner ? (
                    <Button
                      onClick={handleBuy}
                      disabled={!isConnected || isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                          <Send className="w-4 h-4 mr-2" />
                          Transfer NFT
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Transfer NFT</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
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
                            disabled={!transferAddress || isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Transfer NFT
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Owner & Creator Info */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Owner</p>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">
                          {isOwner ? "You" : `${nft.owner.slice(0, 8)}...${nft.owner.slice(-6)}`}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyAddress(nft.owner)}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Link href={`/profile/${nft.owner}`}>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
                        <User className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                    </Link>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Creator</p>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">
                          {isCreator ? "You" : `${nft.creator.slice(0, 8)}...${nft.creator.slice(-6)}`}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyAddress(nft.creator)}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Link href={`/profile/${nft.creator}`}>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
                        <Trophy className="w-4 h-4 mr-1" />
                        View Creator
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price History */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Price History
                </h3>
                <div className="space-y-3">
                  {priceHistory.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-400">{new Date(entry.date).toLocaleDateString()}</span>
                      <span className="text-blue-400 font-medium">{entry.price} ICP</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

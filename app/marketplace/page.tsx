"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NFTImage } from "@/components/nft-image"
import { Search, Filter, ShoppingCart, User, Calendar } from "lucide-react"
import Link from "next/link"
import { useNFTContract } from "@/hooks/use-nft-contract"
import { useWallet } from "@/hooks/use-wallet"
import { toast } from "sonner"

// Demo marketplace NFTs with real Unsplash images
const demoMarketplaceNFTs = [
  {
    id: "1",
    title: "LeBron's Championship Dunk",
    description: "The iconic championship-winning dunk that sealed the Lakers' victory",
    sport: "Basketball",
    playerName: "LeBron James",
    eventDate: "2020-10-11",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop&crop=center",
    owner: "rrkah-fqaaa-aaaaa-aaaaq-cai",
    creator: "rrkah-fqaaa-aaaaa-aaaaq-cai",
    price: "2.5",
    createdAt: "2024-01-15T10:30:00Z",
    views: 1247,
    likes: 89,
  },
  {
    id: "2",
    title: "Messi's World Cup Goal",
    description: "The goal that completed Messi's legacy",
    sport: "Soccer",
    playerName: "Lionel Messi",
    eventDate: "2022-12-18",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop&crop=center",
    owner: "rdmx6-jaaaa-aaaah-qcaiq-cai",
    creator: "rdmx6-jaaaa-aaaah-qcaiq-cai",
    price: "3.2",
    createdAt: "2024-01-10T14:20:00Z",
    views: 2103,
    likes: 156,
  },
  {
    id: "3",
    title: "Nadal's French Open Serve",
    description: "The serve that secured Nadal's 14th French Open title",
    sport: "Tennis",
    playerName: "Rafael Nadal",
    eventDate: "2022-06-05",
    imageUrl: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=400&fit=crop&crop=center",
    owner: "rno2w-sqaaa-aaaah-qcaiq-cai",
    creator: "rno2w-sqaaa-aaaah-qcaiq-cai",
    price: "1.8",
    createdAt: "2024-01-08T16:45:00Z",
    views: 892,
    likes: 67,
  },
  {
    id: "4",
    title: "Curry's Record 3-Pointer",
    description: "The shot that broke the all-time 3-point record",
    sport: "Basketball",
    playerName: "Stephen Curry",
    eventDate: "2021-12-14",
    imageUrl: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=400&h=400&fit=crop&crop=center",
    owner: "renrk-eyaaa-aaaaa-aaada-cai",
    creator: "renrk-eyaaa-aaaaa-aaada-cai",
    price: "2.1",
    createdAt: "2024-01-05T12:15:00Z",
    views: 756,
    likes: 43,
  },
  {
    id: "5",
    title: "Ronaldo's Bicycle Kick",
    description: "The spectacular overhead kick against Juventus",
    sport: "Soccer",
    playerName: "Cristiano Ronaldo",
    eventDate: "2018-04-03",
    imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=400&fit=crop&crop=center",
    owner: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    creator: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    price: "2.8",
    createdAt: "2024-01-03T09:30:00Z",
    views: 1456,
    likes: 98,
  },
  {
    id: "6",
    title: "Serena's Match Point",
    description: "The final point of an incredible Wimbledon victory",
    sport: "Tennis",
    playerName: "Serena Williams",
    eventDate: "2016-07-09",
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=400&fit=crop&crop=center",
    owner: "rkp4c-7iaaa-aaaaa-aaaca-cai",
    creator: "rkp4c-7iaaa-aaaaa-aaaca-cai",
    price: "1.9",
    createdAt: "2024-01-01T18:45:00Z",
    views: 634,
    likes: 52,
  },
  {
    id: "7",
    title: "Jordan's Game Winner",
    description: "The clutch shot that defined a legend",
    sport: "Basketball",
    playerName: "Michael Jordan",
    eventDate: "1998-06-14",
    imageUrl: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=400&fit=crop&crop=center",
    owner: "rno2w-sqaaa-aaaah-qcaiq-cai",
    creator: "rno2w-sqaaa-aaaah-qcaiq-cai",
    price: "4.5",
    createdAt: "2024-01-12T08:20:00Z",
    views: 2890,
    likes: 234,
  },
  {
    id: "8",
    title: "Federer's Backhand",
    description: "The perfect backhand down the line at Wimbledon",
    sport: "Tennis",
    playerName: "Roger Federer",
    eventDate: "2017-07-16",
    imageUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&h=400&fit=crop&crop=center",
    owner: "renrk-eyaaa-aaaaa-aaada-cai",
    creator: "renrk-eyaaa-aaaaa-aaada-cai",
    price: "2.3",
    createdAt: "2024-01-07T15:30:00Z",
    views: 1123,
    likes: 87,
  },
]

export default function MarketplacePage() {
  const { buyNFT, isLoading } = useNFTContract()
  const { isConnected, principal } = useWallet()
  const [nfts, setNfts] = useState<any[]>([])
  const [filteredNfts, setFilteredNfts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sportFilter, setSportFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    loadNFTs()
  }, [])

  useEffect(() => {
    filterAndSortNFTs()
  }, [nfts, searchTerm, sportFilter, sortBy])

  const loadNFTs = async () => {
    try {
      // Use demo data for now
      setNfts(demoMarketplaceNFTs)
    } catch (error) {
      console.error("Error loading NFTs:", error)
      toast.error("Failed to load NFTs")
    }
  }

  const filterAndSortNFTs = () => {
    let filtered = [...nfts]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (nft) =>
          nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nft.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nft.sport.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sport filter
    if (sportFilter !== "all") {
      filtered = filtered.filter((nft) => nft.sport === sportFilter)
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "price-high":
        filtered.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
        break
      case "price-low":
        filtered.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
        break
    }

    setFilteredNfts(filtered)
  }

  const handleBuyNFT = async (nftId: string, price: string) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    try {
      await buyNFT(nftId, price)
      toast.success("NFT purchased successfully!")
      loadNFTs() // Reload to update ownership
    } catch (error) {
      toast.error("Failed to purchase NFT")
      console.error("Buy error:", error)
    }
  }

  const sports = [...new Set(nfts.map((nft) => nft.sport))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">NFT Marketplace</h1>
          <p className="text-gray-400 text-lg">Discover and collect iconic sports moments</p>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search NFTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="All Sports" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-600">
                    All Sports
                  </SelectItem>
                  {sports.map((sport) => (
                    <SelectItem key={sport} value={sport} className="text-white hover:bg-gray-600">
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="newest" className="text-white hover:bg-gray-600">
                    Newest First
                  </SelectItem>
                  <SelectItem value="oldest" className="text-white hover:bg-gray-600">
                    Oldest First
                  </SelectItem>
                  <SelectItem value="price-high" className="text-white hover:bg-gray-600">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="price-low" className="text-white hover:bg-gray-600">
                    Price: Low to High
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center text-gray-400">
                <Filter className="w-4 h-4 mr-2" />
                {filteredNfts.length} NFTs found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NFT Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        ) : filteredNfts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No NFTs Found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNfts.map((nft) => (
              <Card
                key={nft.id}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <Link href={`/nft/${nft.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                      <NFTImage
                        src={nft.imageUrl}
                        alt={`${nft.title} - ${nft.playerName} ${nft.sport} moment`}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4 bg-blue-600/90 text-white">{nft.sport}</Badge>
                      {nft.owner === principal && (
                        <Badge className="absolute top-4 right-4 bg-green-600/90 text-white">Owned</Badge>
                      )}
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link href={`/nft/${nft.id}`}>
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 hover:text-blue-400 cursor-pointer">
                        {nft.title}
                      </h3>
                    </Link>
                    <p className="text-gray-400 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {nft.playerName}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-lg font-bold text-blue-400">{nft.price} ICP</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Owner</p>
                        <p className="text-sm text-gray-300">
                          {nft.owner === principal ? "You" : `${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}`}
                        </p>
                      </div>
                    </div>

                    {nft.eventDate && (
                      <div className="flex items-center text-sm text-gray-400 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(nft.eventDate).toLocaleDateString()}
                      </div>
                    )}

                    {nft.owner !== principal ? (
                      <Button
                        onClick={() => handleBuyNFT(nft.id, nft.price)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        disabled={!isConnected}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-400 bg-transparent"
                        disabled
                      >
                        You Own This NFT
                      </Button>
                    )}
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

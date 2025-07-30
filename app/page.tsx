"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConnectionStatus } from "@/components/connection-status"
import { NFTImage } from "@/components/nft-image"
import { Play, Trophy, Zap, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"

const featuredNFTs = [
  {
    id: 1,
    title: "LeBron's Championship Dunk",
    sport: "Basketball",
    player: "LeBron James",
    price: "2.5 ICP",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop&crop=center",
    creator: "0x1234...5678",
    description:
      "The iconic championship-winning dunk that sealed the Lakers' victory in Game 6 of the 2020 NBA Finals.",
  },
  {
    id: 2,
    title: "Messi's World Cup Goal",
    sport: "Soccer",
    player: "Lionel Messi",
    price: "3.2 ICP",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop&crop=center",
    creator: "0x8765...4321",
    description: "The goal that completed Messi's legacy - his first World Cup triumph with Argentina.",
  },
  {
    id: 3,
    title: "Nadal's French Open Serve",
    sport: "Tennis",
    player: "Rafael Nadal",
    price: "1.8 ICP",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=400&fit=crop&crop=center",
    creator: "0x9876...1234",
    description:
      "The serve that secured Nadal's 14th French Open title, the most dominant performance in tennis history.",
  },
]

export default function HomePage() {
  const { isConnected, connect, principal } = useWallet()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Connection Status */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <ConnectionStatus />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-4 bg-blue-600/20 text-blue-300 border-blue-500/30">
              <Zap className="w-4 h-4 mr-2" />
              Powered by Internet Computer
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Mint Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Moment
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform iconic sports moments into unique NFTs on the Internet Computer. Collect, trade, and own
              legendary athletic achievements forever.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {!isConnected ? (
              <Button
                onClick={connect}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <Link href="/mint">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Mint Your Moment
                </Button>
              </Link>
            )}
            <Link href="/marketplace">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
              >
                Explore Marketplace
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1,247</div>
              <div className="text-gray-400">NFTs Minted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">892</div>
              <div className="text-gray-400">Active Collectors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">45.2K</div>
              <div className="text-gray-400">ICP Volume</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured NFTs */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Moments</h2>
            <p className="text-gray-400 text-lg">Discover the most iconic sports moments in our collection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredNFTs.map((nft) => (
              <Link key={nft.id} href={`/nft/${nft.id}`}>
                <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <NFTImage
                        src={nft.image}
                        alt={`${nft.title} - ${nft.player} ${nft.sport} moment`}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        priority={nft.id <= 3}
                      />
                      <Badge className="absolute top-4 left-4 bg-blue-600/90 text-white">{nft.sport}</Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{nft.title}</h3>
                      <p className="text-gray-400 mb-3">{nft.player}</p>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{nft.description}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="text-lg font-bold text-blue-400">{nft.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Creator</p>
                          <p className="text-sm text-gray-300">{nft.creator}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/marketplace">
              <Button
                variant="outline"
                size="lg"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent"
              >
                View All NFTs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose MintMyMoment?</h2>
            <p className="text-gray-400 text-lg">Built on Internet Computer for true decentralization</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Lightning Fast</h3>
              <p className="text-gray-400">Built on Internet Computer for instant transactions and low fees</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Authentic Moments</h3>
              <p className="text-gray-400">Mint and collect verified iconic sports moments as unique NFTs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Community Driven</h3>
              <p className="text-gray-400">Join a passionate community of sports fans and collectors</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

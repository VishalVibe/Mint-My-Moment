"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Trophy, Calendar, ExternalLink, Copy, Heart, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"
import { toast } from "sonner"

interface UserProfile {
  address: string
  username: string
  bio: string
  avatar: string
  joinDate: string
  stats: {
    nftsOwned: number
    nftsCreated: number
    totalVolume: number
    followers: number
    following: number
  }
  nfts: Array<{
    id: string
    title: string
    imageUrl: string
    price: string
    sport: string
    likes: number
    views: number
  }>
  created: Array<{
    id: string
    title: string
    imageUrl: string
    price: string
    sport: string
    likes: number
    views: number
  }>
}

export default function ProfilePage() {
  const params = useParams()
  const address = params.address as string
  const { principal } = useWallet()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (address) {
      loadProfile()
    }
  }, [address])

  const loadProfile = async () => {
    try {
      // Mock profile data - replace with actual canister call
      const mockProfile: UserProfile = {
        address: address,
        username: address === principal ? "You" : `User ${address.slice(0, 6)}`,
        bio: "Sports NFT collector and enthusiast. Love collecting iconic moments from basketball and soccer.",
        avatar: "/placeholder.svg?height=120&width=120",
        joinDate: "2024-01-15",
        stats: {
          nftsOwned: 12,
          nftsCreated: 5,
          totalVolume: 45.8,
          followers: 234,
          following: 89,
        },
        nfts: [
          {
            id: "1",
            title: "LeBron's Championship Dunk",
            imageUrl: "/placeholder.svg?height=200&width=200",
            price: "2.5",
            sport: "Basketball",
            likes: 89,
            views: 1247,
          },
          {
            id: "2",
            title: "Messi's World Cup Goal",
            imageUrl: "/placeholder.svg?height=200&width=200",
            price: "3.2",
            sport: "Soccer",
            likes: 156,
            views: 2103,
          },
        ],
        created: [
          {
            id: "3",
            title: "Curry's 3-Point Record",
            imageUrl: "/placeholder.svg?height=200&width=200",
            price: "1.8",
            sport: "Basketball",
            likes: 67,
            views: 892,
          },
        ],
      }
      setProfile(mockProfile)
    } catch (error) {
      console.error("Error loading profile:", error)
      toast.error("Failed to load profile")
    }
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address)
    toast.success("Address copied to clipboard!")
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast.success(isFollowing ? "Unfollowed user" : "Following user")
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  const isOwnProfile = address === principal

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <Image
                  src={profile.avatar || "/placeholder.svg"}
                  alt={profile.username}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-blue-500"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{profile.username}</h1>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="font-mono text-sm">
                        {address.slice(0, 12)}...{address.slice(-8)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopyAddress}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {!isOwnProfile && (
                    <Button
                      onClick={handleFollow}
                      className={`${
                        isFollowing
                          ? "bg-gray-600 hover:bg-gray-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <User className="w-4 h-4 mr-2" />
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </div>

                <p className="text-gray-300 mb-6 max-w-2xl">{profile.bio}</p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{profile.stats.nftsOwned}</p>
                    <p className="text-sm text-gray-400">NFTs Owned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{profile.stats.nftsCreated}</p>
                    <p className="text-sm text-gray-400">NFTs Created</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{profile.stats.totalVolume}</p>
                    <p className="text-sm text-gray-400">Total Volume (ICP)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{profile.stats.followers}</p>
                    <p className="text-sm text-gray-400">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{profile.stats.following}</p>
                    <p className="text-sm text-gray-400">Following</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(profile.joinDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NFT Collections */}
        <Tabs defaultValue="owned" className="space-y-6">
          <TabsList className="bg-gray-800/50 border-gray-700">
            <TabsTrigger value="owned" className="data-[state=active]:bg-blue-600">
              Owned ({profile.stats.nftsOwned})
            </TabsTrigger>
            <TabsTrigger value="created" className="data-[state=active]:bg-blue-600">
              Created ({profile.stats.nftsCreated})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owned">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {profile.nfts.map((nft) => (
                <Link key={nft.id} href={`/nft/${nft.id}`}>
                  <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={nft.imageUrl || "/placeholder.svg"}
                          alt={nft.title}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-3 left-3 bg-blue-600/90 text-white text-xs">{nft.sport}</Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2 line-clamp-1">{nft.title}</h3>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-blue-400 font-bold">{nft.price} ICP</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {nft.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {nft.views}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="created">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {profile.created.map((nft) => (
                <Link key={nft.id} href={`/nft/${nft.id}`}>
                  <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={nft.imageUrl || "/placeholder.svg"}
                          alt={nft.title}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-3 left-3 bg-purple-600/90 text-white text-xs">{nft.sport}</Badge>
                        <Badge className="absolute top-3 right-3 bg-green-600/90 text-white text-xs">
                          <Trophy className="w-3 h-3 mr-1" />
                          Creator
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2 line-clamp-1">{nft.title}</h3>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-purple-400 font-bold">{nft.price} ICP</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {nft.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {nft.views}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

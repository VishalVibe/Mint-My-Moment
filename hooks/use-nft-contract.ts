"use client"

import { useState } from "react"
import { toast } from "sonner"

interface NFTMetadata {
  title: string
  description: string
  sport: string
  playerName: string
  eventDate: string
  file: File | null
}

interface NFT {
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
}

// Mock NFT data with real Unsplash images
const mockNFTs: NFT[] = [
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
  },
]

export function useNFTContract() {
  const [isLoading, setIsLoading] = useState(false)

  // Check if IC is available
  const isICAvailable = async () => {
    try {
      // Try to import the actor
      const { mintMyMomentActor } = await import("@/lib/actor")
      await mintMyMomentActor.getTotalNFTs()
      return true
    } catch (error) {
      console.warn("IC not available, using mock data:", error)
      return false
    }
  }

  const mintNFT = async (metadata: NFTMetadata): Promise<string> => {
    setIsLoading(true)
    try {
      const icAvailable = await isICAvailable()

      if (icAvailable) {
        // Use real IC integration
        const { mintMyMomentActor } = await import("@/lib/actor")
        const { ipfsService } = await import("@/lib/ipfs")

        // Upload file to IPFS first
        let imageUrl = ""
        if (metadata.file) {
          toast.success("Uploading to IPFS...")
          try {
            imageUrl = await ipfsService.uploadFile(metadata.file)
          } catch (error) {
            console.warn("IPFS upload failed, using placeholder:", error)
            imageUrl = "/placeholder.svg?height=300&width=300"
          }
        }

        // Create metadata object for IPFS
        const nftMetadata = {
          title: metadata.title,
          description: metadata.description,
          sport: metadata.sport,
          playerName: metadata.playerName,
          eventDate: metadata.eventDate,
          image: imageUrl,
          attributes: [
            { trait_type: "Sport", value: metadata.sport },
            { trait_type: "Player", value: metadata.playerName },
            { trait_type: "Event Date", value: metadata.eventDate },
          ],
        }

        // Upload metadata to IPFS
        const metadataUrl = await ipfsService.uploadJSON(nftMetadata)

        // Prepare data for canister
        const canisterMetadata = {
          title: metadata.title,
          description: metadata.description,
          sport: metadata.sport,
          playerName: metadata.playerName,
          eventDate: metadata.eventDate,
          imageUrl: imageUrl,
          price: BigInt(250000000), // 2.5 ICP in e8s
        }

        toast.success("Minting NFT on blockchain...")
        const result = await mintMyMomentActor.mintNFT(canisterMetadata)

        if ("ok" in result) {
          return result.ok
        } else {
          throw new Error(result.err)
        }
      } else {
        // Use mock implementation
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const mockId = `mock_${Date.now()}`
        toast.success("NFT minted successfully! (Demo Mode)")
        return mockId
      }
    } catch (error) {
      console.error("Error minting NFT:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getAllNFTs = async (): Promise<NFT[]> => {
    setIsLoading(true)
    try {
      const icAvailable = await isICAvailable()

      if (icAvailable) {
        const { mintMyMomentActor } = await import("@/lib/actor")
        const nfts = await mintMyMomentActor.getAllNFTs()
        return nfts.map(formatNFT)
      } else {
        // Return mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockNFTs
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error)
      // Fallback to mock data
      return mockNFTs
    } finally {
      setIsLoading(false)
    }
  }

  const getUserNFTs = async (userPrincipal: string): Promise<NFT[]> => {
    setIsLoading(true)
    try {
      const icAvailable = await isICAvailable()

      if (icAvailable) {
        const { mintMyMomentActor } = await import("@/lib/actor")
        const nfts = await mintMyMomentActor.getUserNFTs(userPrincipal)
        return nfts.map(formatNFT)
      } else {
        // Return mock data filtered by user
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockNFTs.filter((nft) => nft.owner === userPrincipal)
      }
    } catch (error) {
      console.error("Error fetching user NFTs:", error)
      // Fallback to mock data
      return mockNFTs.filter((nft) => nft.owner === userPrincipal)
    } finally {
      setIsLoading(false)
    }
  }

  const buyNFT = async (nftId: string, price: string): Promise<void> => {
    setIsLoading(true)
    try {
      const icAvailable = await isICAvailable()

      if (icAvailable) {
        const { mintMyMomentActor } = await import("@/lib/actor")
        const result = await mintMyMomentActor.buyNFT(nftId)

        if ("err" in result) {
          throw new Error(result.err)
        }
      } else {
        // Mock implementation
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log(`Mock: Buying NFT ${nftId} for ${price} ICP`)
      }
    } catch (error) {
      console.error("Error buying NFT:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const transferNFT = async (nftId: string, toAddress: string): Promise<void> => {
    setIsLoading(true)
    try {
      const icAvailable = await isICAvailable()

      if (icAvailable) {
        const { mintMyMomentActor } = await import("@/lib/actor")
        const result = await mintMyMomentActor.transferNFT(nftId, toAddress)

        if ("err" in result) {
          throw new Error(result.err)
        }
      } else {
        // Mock implementation
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log(`Mock: Transferring NFT ${nftId} to ${toAddress}`)
      }
    } catch (error) {
      console.error("Error transferring NFT:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to format NFT data
  const formatNFT = (nft: any): NFT => ({
    id: nft.id,
    title: nft.title,
    description: nft.description,
    sport: nft.sport,
    playerName: nft.playerName,
    eventDate: nft.eventDate,
    imageUrl: nft.imageUrl,
    owner: nft.owner.toString(),
    creator: nft.creator.toString(),
    price: (Number(nft.price) / 100000000).toFixed(2),
    createdAt: new Date(Number(nft.createdAt) / 1000000).toISOString(),
  })

  return {
    mintNFT,
    getAllNFTs,
    getUserNFTs,
    buyNFT,
    transferNFT,
    isLoading,
  }
}

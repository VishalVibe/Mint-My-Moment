import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory } from "./mintmymoment.did.js"

// Canister ID - replace with your actual canister ID after deployment
const CANISTER_ID = process.env.NEXT_PUBLIC_CANISTER_ID || "rrkah-fqaaa-aaaaa-aaaaq-cai"

// Determine the correct host based on environment
const getHost = () => {
  if (typeof window !== "undefined") {
    // Client-side
    return process.env.NODE_ENV === "production" ? "https://icp-api.io" : "http://127.0.0.1:4943"
  }
  // Server-side
  return process.env.NODE_ENV === "production" ? "https://icp-api.io" : "http://127.0.0.1:4943"
}

// Create agent with better error handling
const createAgent = async () => {
  const host = getHost()

  const agent = new HttpAgent({
    host,
    // Add timeout and retry configuration
    fetchOptions: {
      timeout: 30000, // 30 seconds timeout
    },
  })

  // Only fetch root key in development and handle errors gracefully
  if (process.env.NODE_ENV !== "production") {
    try {
      await agent.fetchRootKey()
      console.log("✅ Connected to local IC replica")
    } catch (error) {
      console.warn("⚠️ Could not connect to local IC replica. Using mock data.")
      console.warn("To fix this, start your local replica with: dfx start")
      // Don't throw error, just continue with mock data
    }
  }

  return agent
}

// Create a singleton agent instance
let agentInstance: HttpAgent | null = null

const getAgent = async () => {
  if (!agentInstance) {
    agentInstance = await createAgent()
  }
  return agentInstance
}

// Create actor with comprehensive error handling
export const createActor = async (canisterId: string, options?: any) => {
  try {
    const agent = await getAgent()

    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
      ...options,
    })
  } catch (error) {
    console.error("Error creating actor:", error)
    // Return a mock actor that throws helpful errors
    return createMockActor()
  }
}

// Mock actor for when IC is not available
const createMockActor = () => {
  const mockError = () => {
    throw new Error(
      "Internet Computer replica not available. Please start your local replica with 'dfx start' or check your network connection.",
    )
  }

  return {
    mintNFT: mockError,
    getAllNFTs: mockError,
    getUserNFTs: mockError,
    transferNFT: mockError,
    buyNFT: mockError,
    getNFT: mockError,
    getTotalNFTs: mockError,
  }
}

// Initialize actor lazily
let actorInstance: any = null

export const getMintMyMomentActor = async () => {
  if (!actorInstance) {
    actorInstance = await createActor(CANISTER_ID)
  }
  return actorInstance
}

// For backward compatibility
export const mintMyMomentActor = {
  mintNFT: async (...args: any[]) => {
    const actor = await getMintMyMomentActor()
    return actor.mintNFT(...args)
  },
  getAllNFTs: async (...args: any[]) => {
    const actor = await getMintMyMomentActor()
    return actor.getAllNFTs(...args)
  },
  getUserNFTs: async (...args: any[]) => {
    const actor = await getMintMyMomentActor()
    return actor.getUserNFTs(...args)
  },
  transferNFT: async (...args: any[]) => {
    const actor = await getMintMyMomentActor()
    return actor.transferNFT(...args)
  },
  buyNFT: async (...args: any[]) => {
    const actor = await getMintMyMomentActor()
    return actor.buyNFT(...args)
  },
  getNFT: async (...args: any[]) => {
    const actor = await getMintMyMomentActor()
    return actor.getNFT(...args)
  },
  getTotalNFTs: async (...args: any[]) => {
    const actor = await getMintMyMomentActor()
    return actor.getTotalNFTs(...args)
  },
}

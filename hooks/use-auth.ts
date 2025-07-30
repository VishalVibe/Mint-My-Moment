"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { useWallet } from "./use-wallet"

interface User {
  principal: string
  username?: string
  email?: string
  role: "user" | "admin" | "moderator"
  isVerified: boolean
  createdAt: string
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isModerator: boolean
  login: () => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
  canAccessAdmin: () => boolean
  canModerateContent: () => boolean
  canMintNFT: () => boolean
  canTransferNFT: (nftOwnerId: string) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Admin principals - replace with your actual admin addresses
const ADMIN_PRINCIPALS = [
  "rrkah-fqaaa-aaaaa-aaaaq-cai", // Replace with actual admin principal
  // Add more admin principals here
]

const MODERATOR_PRINCIPALS = [
  "rdmx6-jaaaa-aaaah-qcaiq-cai", // Replace with actual moderator principals
  // Add more moderator principals here
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isConnected, principal, connect, disconnect } = useWallet()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (isConnected && principal) {
      loadUserProfile()
    } else {
      setUser(null)
    }
  }, [isConnected, principal])

  const loadUserProfile = async () => {
    if (!principal) return

    try {
      // In a real implementation, this would fetch from your canister
      const isAdmin = ADMIN_PRINCIPALS.includes(principal)
      const isModerator = MODERATOR_PRINCIPALS.includes(principal)

      const userProfile: User = {
        principal,
        role: isAdmin ? "admin" : isModerator ? "moderator" : "user",
        isVerified: true, // You could implement verification logic
        createdAt: new Date().toISOString(),
        permissions: getPermissions(isAdmin, isModerator),
      }

      setUser(userProfile)
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  const getPermissions = (isAdmin: boolean, isModerator: boolean): string[] => {
    const permissions = ["mint_nft", "buy_nft", "transfer_own_nft"]

    if (isModerator) {
      permissions.push("moderate_content", "view_reports", "suspend_users")
    }

    if (isAdmin) {
      permissions.push(
        "admin_dashboard",
        "manage_users",
        "manage_platform",
        "view_analytics",
        "moderate_all_content",
        "system_settings",
      )
    }

    return permissions
  }

  const login = async () => {
    await connect()
  }

  const logout = () => {
    disconnect()
    setUser(null)
  }

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false
  }

  const canAccessAdmin = (): boolean => {
    return hasPermission("admin_dashboard")
  }

  const canModerateContent = (): boolean => {
    return hasPermission("moderate_content") || hasPermission("moderate_all_content")
  }

  const canMintNFT = (): boolean => {
    return isConnected && hasPermission("mint_nft")
  }

  const canTransferNFT = (nftOwnerId: string): boolean => {
    if (!user) return false

    // Users can transfer their own NFTs
    if (nftOwnerId === user.principal) return true

    // Admins can transfer any NFT (for moderation purposes)
    return hasPermission("moderate_all_content")
  }

  const value = {
    user,
    isAuthenticated: isConnected && !!user,
    isAdmin: user?.role === "admin" || false,
    isModerator: user?.role === "moderator" || false,
    login,
    logout,
    hasPermission,
    canAccessAdmin,
    canModerateContent,
    canMintNFT,
    canTransferNFT,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

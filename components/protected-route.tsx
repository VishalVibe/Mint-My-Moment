"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Lock, AlertTriangle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  requireModerator?: boolean
  requiredPermissions?: string[]
  fallbackPath?: string
}

export function ProtectedRoute({
  children,
  requireAuth = false,
  requireAdmin = false,
  requireModerator = false,
  requiredPermissions = [],
  fallbackPath = "/",
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isModerator, hasPermission, login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      // Don't redirect, just show login prompt
      return
    }

    if (requireAdmin && !isAdmin) {
      router.push(fallbackPath)
      return
    }

    if (requireModerator && !isModerator && !isAdmin) {
      router.push(fallbackPath)
      return
    }

    if (requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every((permission) => hasPermission(permission))
      if (!hasAllPermissions) {
        router.push(fallbackPath)
        return
      }
    }
  }, [isAuthenticated, isAdmin, isModerator, requiredPermissions])

  // Show login prompt if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <Lock className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-gray-400 mb-6">You need to connect your wallet to access this page.</p>
            <Button onClick={login} className="w-full bg-blue-600 hover:bg-blue-700">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show access denied if user doesn't have required permissions
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-400 mb-6">You don't have permission to access this page. Admin access required.</p>
            <Button
              onClick={() => router.push(fallbackPath)}
              variant="outline"
              className="border-gray-600 text-gray-300 bg-transparent"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (requireModerator && !isModerator && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Moderator Access Required</h2>
            <p className="text-gray-400 mb-6">You need moderator privileges to access this page.</p>
            <Button
              onClick={() => router.push(fallbackPath)}
              variant="outline"
              className="border-gray-600 text-gray-300 bg-transparent"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((permission) => hasPermission(permission))
    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
            <CardContent className="p-8 text-center">
              <Lock className="w-16 h-16 text-orange-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Insufficient Permissions</h2>
              <p className="text-gray-400 mb-6">You don't have the required permissions to access this page.</p>
              <Button
                onClick={() => router.push(fallbackPath)}
                variant="outline"
                className="border-gray-600 text-gray-300 bg-transparent"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  return <>{children}</>
}

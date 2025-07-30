"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Wifi, WifiOff, RefreshCw } from "lucide-react"

interface ConnectionStatusProps {
  className?: string
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const [icStatus, setIcStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [isChecking, setIsChecking] = useState(false)

  const checkICConnection = async () => {
    setIsChecking(true)
    try {
      // Try to connect to local replica
      const response = await fetch("http://127.0.0.1:4943/api/v2/status", {
        method: "GET",
        timeout: 5000,
      } as any)

      if (response.ok) {
        setIcStatus("connected")
      } else {
        setIcStatus("disconnected")
      }
    } catch (error) {
      setIcStatus("disconnected")
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkICConnection()
  }, [])

  const getStatusInfo = () => {
    switch (icStatus) {
      case "connected":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: "IC Connected",
          description: "Connected to Internet Computer replica",
          color: "bg-green-600/20 text-green-300 border-green-500/30",
        }
      case "disconnected":
        return {
          icon: <WifiOff className="w-4 h-4" />,
          text: "IC Offline",
          description: "Using demo mode. Start local replica with 'dfx start'",
          color: "bg-yellow-600/20 text-yellow-300 border-yellow-500/30",
        }
      default:
        return {
          icon: <Wifi className="w-4 h-4 animate-pulse" />,
          text: "Checking...",
          description: "Checking Internet Computer connection",
          color: "bg-blue-600/20 text-blue-300 border-blue-500/30",
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <Card className={`bg-gray-800/50 border-gray-700 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={statusInfo.color}>
              {statusInfo.icon}
              {statusInfo.text}
            </Badge>
            <div>
              <p className="text-sm text-gray-300">{statusInfo.description}</p>
              {icStatus === "disconnected" && (
                <p className="text-xs text-gray-400 mt-1">All features work in demo mode with mock data</p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkICConnection}
            disabled={isChecking}
            className="border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

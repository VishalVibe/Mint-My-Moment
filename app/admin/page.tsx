"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Trophy, Users, DollarSign, TrendingUp, Activity, Eye, Download, Shield, AlertTriangle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useNFTContract } from "@/hooks/use-nft-contract"

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"]

function AdminDashboardContent() {
  const { user, hasPermission } = useAuth()
  const { getAllNFTs, isLoading } = useNFTContract()
  const [stats, setStats] = useState({
    totalNFTs: 0,
    totalUsers: 0,
    totalVolume: 0,
    avgPrice: 0,
  })
  const [nfts, setNfts] = useState<any[]>([])
  const [sportData, setSportData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [reportedContent, setReportedContent] = useState([
    {
      id: "1",
      type: "NFT",
      title: "Suspicious Sports Moment",
      reporter: "user123",
      reason: "Copyright infringement",
      status: "pending",
      createdAt: "2024-01-20",
    },
    {
      id: "2",
      type: "User",
      title: "Spam Account",
      reporter: "user456",
      reason: "Spam behavior",
      status: "resolved",
      createdAt: "2024-01-19",
    },
  ])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const allNfts = await getAllNFTs()
      setNfts(allNfts)

      // Calculate stats
      const uniqueUsers = new Set([...allNfts.map((nft) => nft.owner), ...allNfts.map((nft) => nft.creator)])
      const totalVolume = allNfts.reduce((sum, nft) => sum + Number.parseFloat(nft.price), 0)

      setStats({
        totalNFTs: allNfts.length,
        totalUsers: uniqueUsers.size,
        totalVolume: totalVolume,
        avgPrice: allNfts.length > 0 ? totalVolume / allNfts.length : 0,
      })

      // Sport distribution
      const sportCounts = allNfts.reduce((acc, nft) => {
        acc[nft.sport] = (acc[nft.sport] || 0) + 1
        return acc
      }, {})

      setSportData(
        Object.entries(sportCounts).map(([sport, count]) => ({
          name: sport,
          value: count,
        })),
      )

      // Monthly minting data (mock)
      setMonthlyData([
        { month: "Jan", nfts: 45, volume: 120.5 },
        { month: "Feb", nfts: 67, volume: 180.2 },
        { month: "Mar", nfts: 89, volume: 245.8 },
        { month: "Apr", nfts: 123, volume: 320.4 },
        { month: "May", nfts: 156, volume: 410.6 },
        { month: "Jun", nfts: 198, volume: 520.3 },
      ])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
  }

  const handleReportAction = (reportId: string, action: "approve" | "reject") => {
    setReportedContent((prev) =>
      prev.map((report) =>
        report.id === reportId ? { ...report, status: action === "approve" ? "resolved" : "rejected" } : report,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Platform analytics and management</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-red-600/20 text-red-300 border-red-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Admin Access
              </Badge>
              <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                {user?.principal.slice(0, 8)}...{user?.principal.slice(-6)}
              </Badge>
            </div>
          </div>
          {hasPermission("view_analytics") && (
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total NFTs</p>
                  <p className="text-2xl font-bold text-white">{stats.totalNFTs}</p>
                </div>
                <Trophy className="w-8 h-8 text-blue-400" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400 text-sm">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400 text-sm">+8% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Volume</p>
                  <p className="text-2xl font-bold text-white">{stats.totalVolume.toFixed(2)} ICP</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400 text-sm">+24% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Price</p>
                  <p className="text-2xl font-bold text-white">{stats.avgPrice.toFixed(2)} ICP</p>
                </div>
                <Activity className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400 text-sm">+5% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="bg-gray-800/50 border-gray-700">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="nfts" className="data-[state=active]:bg-blue-600">
              NFT Management
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
              User Management
            </TabsTrigger>
            {hasPermission("moderate_content") && (
              <TabsTrigger value="moderation" className="data-[state=active]:bg-blue-600">
                Moderation
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Activity Chart */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Monthly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="nfts" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Sport Distribution */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Sport Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sportData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sportData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Reported Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportedContent.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge
                            className={`${
                              report.type === "NFT"
                                ? "bg-blue-600/20 text-blue-300"
                                : "bg-purple-600/20 text-purple-300"
                            }`}
                          >
                            {report.type}
                          </Badge>
                          <h4 className="font-semibold text-white">{report.title}</h4>
                          <Badge
                            className={`${
                              report.status === "pending"
                                ? "bg-yellow-600/20 text-yellow-300"
                                : report.status === "resolved"
                                  ? "bg-green-600/20 text-green-300"
                                  : "bg-red-600/20 text-red-300"
                            }`}
                          >
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">
                          <strong>Reason:</strong> {report.reason}
                        </p>
                        <p className="text-sm text-gray-400">
                          <strong>Reporter:</strong> {report.reporter} • {report.createdAt}
                        </p>
                      </div>
                      {report.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReportAction(report.id, "approve")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReportAction(report.id, "reject")}
                            className="border-red-600 text-red-300 hover:bg-red-600/10"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nfts" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent NFTs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nfts.slice(0, 10).map((nft) => (
                    <div key={nft.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={nft.imageUrl || "/placeholder.svg?height=50&width=50"}
                          alt={nft.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-white">{nft.title}</h4>
                          <p className="text-sm text-gray-400">
                            {nft.playerName} • {nft.sport}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className="bg-blue-600/20 text-blue-300">{nft.price} ICP</Badge>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {hasPermission("moderate_all_content") && (
                          <Button size="sm" variant="outline" className="border-red-600 text-red-300 bg-transparent">
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">User Management</h3>
                  <p className="text-gray-400">Advanced user analytics and management tools.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}

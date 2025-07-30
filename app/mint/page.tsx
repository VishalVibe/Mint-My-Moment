"use client"

import { ProtectedRoute } from "@/components/protected-route"
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, Trophy, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useNFTContract } from "@/hooks/use-nft-contract"
import { toast } from "sonner"

const sports = [
  "Basketball",
  "Soccer",
  "Tennis",
  "Baseball",
  "Football",
  "Hockey",
  "Golf",
  "Swimming",
  "Track & Field",
  "Boxing",
]

function MintPageContent() {
  const { canMintNFT } = useAuth()
  const { mintNFT, isLoading } = useNFTContract()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sport: "",
    playerName: "",
    eventDate: "",
    file: null as File | null,
  })

  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please upload an image or video file")
      return
    }

    setFormData((prev) => ({ ...prev, file }))

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canMintNFT()) {
      toast.error("You don't have permission to mint NFTs")
      return
    }

    if (!formData.file || !formData.title || !formData.sport || !formData.playerName) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      await mintNFT(formData)
      toast.success("NFT minted successfully!")

      // Reset form
      setFormData({
        title: "",
        description: "",
        sport: "",
        playerName: "",
        eventDate: "",
        file: null,
      })
      setPreview(null)
    } catch (error) {
      toast.error("Failed to mint NFT. Please try again.")
      console.error("Mint error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Mint Your Sports Moment</h1>
          <p className="text-gray-400 text-lg">Transform your favorite sports moment into a unique NFT</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="space-y-4">
                    {formData.file?.type.startsWith("video/") ? (
                      <video src={preview} controls className="w-full max-h-64 rounded-lg" />
                    ) : (
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full max-h-64 object-cover rounded-lg"
                      />
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPreview(null)
                        setFormData((prev) => ({ ...prev, file: null }))
                      }}
                      className="border-gray-600 text-gray-300"
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-2">Drag and drop your file here, or click to browse</p>
                      <p className="text-gray-400 text-sm">Supports images and videos up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent" asChild>
                        <span className="cursor-pointer">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Form Section */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">NFT Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-gray-300">
                    Title <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., LeBron's Championship Dunk"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this iconic sports moment..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sport" className="text-gray-300">
                      Sport <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.sport}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, sport: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {sports.map((sport) => (
                          <SelectItem key={sport} value={sport} className="text-white hover:bg-gray-600">
                            {sport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="playerName" className="text-gray-300">
                      Player Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="playerName"
                      value={formData.playerName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, playerName: e.target.value }))}
                      placeholder="e.g., LeBron James"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="eventDate" className="text-gray-300">
                    Event Date
                  </Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, eventDate: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  disabled={isLoading || !canMintNFT()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4 mr-2" />
                      Mint NFT
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function MintPage() {
  return (
    <ProtectedRoute requireAuth={true} requiredPermissions={["mint_nft"]}>
      <MintPageContent />
    </ProtectedRoute>
  )
}

// IPFS integration for decentralized file storage
export class IPFSService {
  private static instance: IPFSService
  private ipfsGateway = "https://gateway.pinata.cloud/ipfs/"
  private pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
  private pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY

  static getInstance(): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService()
    }
    return IPFSService.instance
  }

  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const metadata = JSON.stringify({
        name: file.name,
        keyvalues: {
          platform: "MintMyMoment",
          type: "nft-media",
        },
      })
      formData.append("pinataMetadata", metadata)

      const options = JSON.stringify({
        cidVersion: 0,
      })
      formData.append("pinataOptions", options)

      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          pinata_api_key: this.pinataApiKey!,
          pinata_secret_api_key: this.pinataSecretKey!,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload to IPFS")
      }

      const result = await response.json()
      return `${this.ipfsGateway}${result.IpfsHash}`
    } catch (error) {
      console.error("IPFS upload error:", error)
      throw new Error("Failed to upload file to IPFS")
    }
  }

  async uploadJSON(data: any): Promise<string> {
    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: this.pinataApiKey!,
          pinata_secret_api_key: this.pinataSecretKey!,
        },
        body: JSON.stringify({
          pinataContent: data,
          pinataMetadata: {
            name: "NFT Metadata",
            keyvalues: {
              platform: "MintMyMoment",
              type: "nft-metadata",
            },
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to upload metadata to IPFS")
      }

      const result = await response.json()
      return `${this.ipfsGateway}${result.IpfsHash}`
    } catch (error) {
      console.error("IPFS metadata upload error:", error)
      throw new Error("Failed to upload metadata to IPFS")
    }
  }
}

export const ipfsService = IPFSService.getInstance()

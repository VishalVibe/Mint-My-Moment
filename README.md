# 🏆 MintMyMoment - DeFi NFT Sports Platform

Transform iconic sports moments into unique NFTs on the Internet Computer Protocol.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/mintmymoment)

## 🚀 Quick Start

### One-Command Local Setup
\`\`\`bash
git clone <your-repo>
cd mintmymoment
chmod +x scripts/*.sh
./scripts/deploy-local.sh
npm run dev
\`\`\`

Visit: **http://localhost:3000**

## ✨ Features

- 🎯 **NFT Minting** - Create sports moment NFTs with metadata
- 🛒 **Marketplace** - Buy, sell, and trade NFTs
- 👤 **User Profiles** - Personal collections and social features  
- 🔐 **Wallet Integration** - Seamless Plug Wallet connection
- 📊 **Admin Dashboard** - Platform analytics and management
- 🌐 **IPFS Storage** - Decentralized media storage via Pinata
- ⚡ **Lightning Fast** - Built on Internet Computer

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14, React, Tailwind CSS |
| **Backend** | Internet Computer (Motoko) |
| **Wallet** | Plug Wallet Integration |
| **Storage** | IPFS via Pinata |
| **Deployment** | Vercel + Internet Computer |

## 📦 Installation

### Prerequisites
- Node.js 18+
- DFINITY SDK (dfx)
- Git

### Local Development
\`\`\`bash
# Clone repository
git clone <your-repository>
cd mintmymoment

# Make scripts executable
chmod +x scripts/*.sh

# Deploy locally (one command setup)
./scripts/deploy-local.sh

# Start development server
npm run dev
\`\`\`

## 🚀 Deployment

### 🏠 Local Deployment
\`\`\`bash
npm run deploy:local
\`\`\`

### 🌐 Production Deployment
\`\`\`bash
# Deploy backend to Internet Computer
npm run deploy:production

# Deploy frontend to Vercel
npm run deploy:vercel
\`\`\`

### 📋 Environment Variables

#### Local (.env.local)
\`\`\`env
NEXT_PUBLIC_CANISTER_ID=<local-canister-id>
NEXT_PUBLIC_IC_HOST=http://127.0.0.1:4943
\`\`\`

#### Production (Vercel)
\`\`\`env
NEXT_PUBLIC_CANISTER_ID=<mainnet-canister-id>
NEXT_PUBLIC_IC_HOST=https://icp-api.io
NEXT_PUBLIC_PINATA_API_KEY=<your-pinata-key>
NEXT_PUBLIC_PINATA_SECRET_KEY=<your-pinata-secret>
\`\`\`

## 🏗️ Project Structure

\`\`\`
mintmymoment/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── marketplace/       # NFT marketplace
│   ├── mint/             # NFT minting page
│   ├── my-nfts/          # User's NFT collection
│   └── nft/[id]/         # NFT details page
├── components/            # Reusable components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── backend/              # Motoko smart contracts
├── scripts/              # Deployment scripts
└── public/               # Static assets
\`\`\`

## 🎯 Key Features

### 🎨 NFT Minting
- Upload images/videos (up to 10MB)
- Rich metadata (title, description, sport, player)
- IPFS storage integration
- Blockchain minting via Motoko canisters

### 🛒 Marketplace
- Browse all NFTs with filtering
- Search by sport, player, or title
- Buy NFTs with ICP tokens
- Price history tracking

### 👤 User Profiles
- Personal NFT collections
- Created vs owned NFTs
- Social features (follow/unfollow)
- Portfolio statistics

### 🔐 Admin Dashboard
- Platform analytics
- User management
- NFT oversight
- Revenue tracking

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run deploy:local` | Deploy to local IC replica |
| `npm run deploy:production` | Deploy to IC mainnet |
| `npm run deploy:vercel` | Deploy frontend to Vercel |
| `npm run setup` | Complete local setup |
| `npm run reset` | Clean and reinstall everything |

## 🌐 Deployment URLs

### Local Development
- **Frontend**: http://localhost:3000
- **Backend**: http://127.0.0.1:4943/?canisterId=<canister-id>
- **Candid UI**: http://127.0.0.1:4943/?canisterId=<candid-ui>&id=<backend-id>

### Production
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://<canister-id>.icp0.io
- **Candid UI**: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=<canister-id>

## 📖 API Documentation

### Motoko Canister Methods

```motoko
// Mint a new NFT
mintNFT(metadata: NFTMetadata) : async Result<Text, Text>

// Get all platform NFTs
getAllNFTs() : async [NFT]

// Get user's NFTs
getUserNFTs(principal: Principal) : async [NFT]

// Transfer NFT ownership
transferNFT(id: Text, recipient: Principal) : async Result<(), Text>

// Purchase an NFT
buyNFT(id: Text) : async Result<(), Text>

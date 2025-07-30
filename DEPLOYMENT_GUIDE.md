# 🚀 MintMyMoment Deployment Guide

Complete guide to deploy your NFT platform locally and to production.

## 📋 Prerequisites

### Required Software
- **Node.js 18+** - [Download](https://nodejs.org/)
- **DFINITY SDK (dfx)** - [Install Guide](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- **Git** - [Download](https://git-scm.com/)

### Optional Services
- **Pinata Account** - For IPFS storage ([Sign up](https://pinata.cloud/))
- **Vercel Account** - For frontend hosting ([Sign up](https://vercel.com/))

## 🏠 Local Development Deployment

### Step 1: Clone and Setup
\`\`\`bash
git clone <your-repository>
cd mintmymoment
chmod +x scripts/*.sh
\`\`\`

### Step 2: Deploy Locally
\`\`\`bash
./scripts/deploy-local.sh
\`\`\`

This script will:
- ✅ Check all prerequisites
- ✅ Install dependencies
- ✅ Start local IC replica
- ✅ Deploy canisters
- ✅ Create environment configuration
- ✅ Build the application

### Step 3: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit: **http://localhost:3000**

### 🔧 Local Development URLs
- **Frontend**: http://localhost:3000
- **Backend Canister**: http://127.0.0.1:4943/?canisterId=<canister-id>
- **Candid UI**: http://127.0.0.1:4943/?canisterId=<candid-ui-id>&id=<backend-id>

## 🌐 Production Deployment

### Step 1: Deploy to Internet Computer
\`\`\`bash
./scripts/deploy-production.sh
\`\`\`

**Requirements:**
- ICP cycles (2-5 ICP for initial deployment)
- dfx identity with wallet

**What it does:**
- ✅ Deploys smart contracts to IC mainnet
- ✅ Creates production environment config
- ✅ Provides live canister URLs

### Step 2: Deploy Frontend to Vercel
\`\`\`bash
./scripts/deploy-vercel.sh
\`\`\`

**What it does:**
- ✅ Installs Vercel CLI
- ✅ Builds production frontend
- ✅ Deploys to Vercel
- ✅ Provides deployment URL

## 🔐 Environment Variables

### Local Development (.env.local)
\`\`\`env
NEXT_PUBLIC_CANISTER_ID=<local-canister-id>
NEXT_PUBLIC_IC_HOST=http://127.0.0.1:4943
NODE_ENV=development
\`\`\`

### Production (.env.production)
\`\`\`env
NEXT_PUBLIC_CANISTER_ID=<mainnet-canister-id>
NEXT_PUBLIC_IC_HOST=https://icp-api.io
NEXT_PUBLIC_PINATA_API_KEY=<your-pinata-key>
NEXT_PUBLIC_PINATA_SECRET_KEY=<your-pinata-secret>
NODE_ENV=production
\`\`\`

### Vercel Dashboard Settings
Set these in your Vercel project settings:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_CANISTER_ID` | Your backend canister ID | Production |
| `NEXT_PUBLIC_IC_HOST` | `https://icp-api.io` | Production |
| `NEXT_PUBLIC_PINATA_API_KEY` | Your Pinata API key | Production |
| `NEXT_PUBLIC_PINATA_SECRET_KEY` | Your Pinata secret | Production |

## 📊 Deployment Architecture

\`\`\`
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Vercel        │    │ Internet Computer│    │     IPFS        │
│   (Frontend)    │◄──►│   (Backend)      │◄──►│   (Storage)     │
│                 │    │                  │    │                 │
│ • Next.js App   │    │ • Motoko Smart   │    │ • NFT Images    │
│ • React UI      │    │   Contracts      │    │ • Metadata      │
│ • Wallet Connect│    │ • User Auth      │    │ • Decentralized │
└─────────────────┘    └──────────────────┘    └─────────────────┘
\`\`\`

## 🛠️ Manual Deployment Steps

### 1. Internet Computer Backend

\`\`\`bash
# Start local replica (development)
dfx start --background --clean

# Deploy locally
dfx deploy --network local

# Deploy to mainnet (production)
dfx deploy --network ic --with-cycles 2000000000000
\`\`\`

### 2. Frontend Build

\`\`\`bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
\`\`\`

### 3. Vercel Deployment

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
\`\`\`

## 🔍 Troubleshooting

### Common Issues

#### 1. dfx Command Not Found
\`\`\`bash
# Install DFINITY SDK
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
\`\`\`

#### 2. Insufficient Cycles
- Visit [NNS App](https://nns.ic0.app/) to buy cycles
- Use [Cycles Faucet](https://faucet.dfinity.org/) for testnet

#### 3. Build Failures
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
\`\`\`

#### 4. Canister Not Found
\`\`\`bash
# Check canister status
dfx canister status --all --network local

# Redeploy if needed
dfx deploy --network local
\`\`\`

### 5. Image Loading Issues
- Ensure Unsplash images are accessible
- Check Next.js image configuration
- Verify CORS settings

## 📈 Monitoring & Maintenance

### Canister Monitoring
\`\`\`bash
# Check canister status
dfx canister status mintmymoment_backend --network ic

# Check cycles balance
dfx canister status mintmymoment_backend --network ic | grep "Balance"

# Top up cycles
dfx canister deposit-cycles <amount> mintmymoment_backend --network ic
\`\`\`

### Performance Monitoring
- Use Vercel Analytics for frontend metrics
- Monitor IC canister performance
- Track IPFS upload success rates

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] IPFS service (Pinata) set up
- [ ] Sufficient ICP cycles available
- [ ] Code committed to Git

### Local Deployment
- [ ] dfx replica running
- [ ] Canisters deployed successfully
- [ ] Frontend builds without errors
- [ ] Wallet connection working
- [ ] NFT minting functional

### Production Deployment
- [ ] Backend deployed to IC mainnet
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] HTTPS working correctly
- [ ] All features tested in production

### Post-Deployment
- [ ] Monitor canister cycles
- [ ] Test all user flows
- [ ] Verify IPFS uploads
- [ ] Check analytics setup
- [ ] Document deployment details

## 🆘 Support

### Getting Help
- **DFINITY Forum**: [forum.dfinity.org](https://forum.dfinity.org/)
- **Vercel Support**: [vercel.com/help](https://vercel.com/help)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

### Useful Commands
\`\`\`bash
# Check dfx version
dfx --version

# List all canisters
dfx canister list --network local

# View canister logs
dfx canister logs mintmymoment_backend --network local

# Reset local state
dfx start --clean
\`\`\`

---

🎉 **Your MintMyMoment NFT platform is ready to launch!**

Follow this guide step by step, and you'll have a fully functional NFT marketplace running on the Internet Computer with a beautiful frontend hosted on Vercel.

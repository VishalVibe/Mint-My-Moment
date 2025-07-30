#!/bin/bash

echo "🚀 MintMyMoment Deployment Script"
echo "=================================="

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install DFINITY SDK first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check environment variables
if [ -z "$NEXT_PUBLIC_CANISTER_ID" ]; then
    echo "⚠️  NEXT_PUBLIC_CANISTER_ID not set. Using local development mode."
fi

if [ -z "$NEXT_PUBLIC_PINATA_API_KEY" ]; then
    echo "⚠️  NEXT_PUBLIC_PINATA_API_KEY not set. IPFS uploads will use fallback."
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Starting local Internet Computer replica..."
dfx start --background --clean

echo ""
echo "🏗️  Building and deploying canisters..."
dfx deploy --network local

# Get canister IDs
BACKEND_CANISTER_ID=$(dfx canister id mintmymoment_backend --network local)
FRONTEND_CANISTER_ID=$(dfx canister id mintmymoment_frontend --network local)

echo ""
echo "✅ Deployment successful!"
echo "========================"
echo "Backend Canister ID: $BACKEND_CANISTER_ID"
echo "Frontend Canister ID: $FRONTEND_CANISTER_ID"
echo ""
echo "🌐 Local URLs:"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000/?canisterId=$BACKEND_CANISTER_ID"
echo ""
echo "🔧 Next steps:"
echo "1. Update your .env.local file with the canister ID:"
echo "   NEXT_PUBLIC_CANISTER_ID=$BACKEND_CANISTER_ID"
echo ""
echo "2. Start the frontend development server:"
echo "   npm run dev"
echo ""
echo "3. For mainnet deployment, run:"
echo "   ./scripts/deploy-mainnet.sh"
echo ""
echo "🎉 Happy minting!"

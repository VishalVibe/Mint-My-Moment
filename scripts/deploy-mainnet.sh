#!/bin/bash

echo "🌐 MintMyMoment Mainnet Deployment"
echo "=================================="

# Check if user has cycles
echo "⚠️  Mainnet deployment requires ICP cycles."
echo "Make sure you have sufficient cycles in your wallet."
echo ""
read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

# Check environment variables
if [ -z "$NEXT_PUBLIC_CANISTER_ID" ]; then
    echo "❌ NEXT_PUBLIC_CANISTER_ID not set. Please set this environment variable."
    exit 1
fi

if [ -z "$NEXT_PUBLIC_PINATA_API_KEY" ]; then
    echo "⚠️  NEXT_PUBLIC_PINATA_API_KEY not set. IPFS uploads may not work."
fi

echo ""
echo "🏗️  Building for production..."
npm run build

echo ""
echo "🚀 Deploying to Internet Computer mainnet..."
dfx deploy --network ic --with-cycles 1000000000000

# Get mainnet canister IDs
BACKEND_CANISTER_ID=$(dfx canister id mintmymoment_backend --network ic)
FRONTEND_CANISTER_ID=$(dfx canister id mintmymoment_frontend --network ic)

echo ""
echo "✅ Mainnet deployment successful!"
echo "================================"
echo "Backend Canister ID: $BACKEND_CANISTER_ID"
echo "Frontend Canister ID: $FRONTEND_CANISTER_ID"
echo ""
echo "🌐 Live URLs:"
echo "Frontend: https://$FRONTEND_CANISTER_ID.ic0.app"
echo "Backend: https://$BACKEND_CANISTER_ID.ic0.app"
echo ""
echo "🔧 Update your production environment:"
echo "NEXT_PUBLIC_CANISTER_ID=$BACKEND_CANISTER_ID"
echo "NEXT_PUBLIC_IC_HOST=https://mainnet.dfinity.network"
echo ""
echo "🎉 Your NFT platform is now live on the Internet Computer!"

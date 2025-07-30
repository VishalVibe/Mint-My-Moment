#!/bin/bash

echo "🌐 MintMyMoment Production Deployment"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if user has cycles
print_warning "Production deployment requires ICP cycles."
print_warning "Make sure you have sufficient cycles in your wallet."
print_warning "Estimated cost: ~2-5 ICP for initial deployment"
echo ""
read -p "Do you want to continue with production deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Deployment cancelled."
    exit 0
fi

# Check required tools
if ! command -v dfx &> /dev/null; then
    print_error "dfx is not installed. Please install DFINITY SDK first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if user is authenticated
print_status "Checking dfx identity..."
if ! dfx identity whoami &> /dev/null; then
    print_error "No dfx identity found. Please create or import an identity first."
    echo "Run: dfx identity new <identity-name>"
    echo "Or: dfx identity import <identity-name> <pem-file>"
    exit 1
fi

CURRENT_IDENTITY=$(dfx identity whoami)
print_success "Using identity: $CURRENT_IDENTITY"

# Check wallet balance
print_status "Checking wallet balance..."
BALANCE=$(dfx wallet balance --network ic 2>/dev/null || echo "0")
print_status "Wallet balance: $BALANCE"

if [[ "$BALANCE" == "0"* ]]; then
    print_warning "Low or no cycles detected. You may need to top up your wallet."
    print_status "Visit: https://faucet.dfinity.org/ for free cycles (testnet)"
    print_status "Or: https://nns.ic0.app/ to buy cycles with ICP"
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build for production
print_status "Building for production..."
if npm run build; then
    print_success "Production build completed"
else
    print_error "Production build failed"
    exit 1
fi

# Deploy to mainnet
print_status "Deploying to Internet Computer mainnet..."
print_warning "This will consume cycles from your wallet..."

if dfx deploy --network ic --with-cycles 2000000000000; then
    print_success "Deployment to mainnet completed!"
else
    print_error "Deployment failed"
    print_status "Common issues:"
    print_status "1. Insufficient cycles - top up your wallet"
    print_status "2. Network issues - try again later"
    print_status "3. Identity issues - check dfx identity"
    exit 1
fi

# Get mainnet canister IDs
BACKEND_CANISTER_ID=$(dfx canister id mintmymoment_backend --network ic)
FRONTEND_CANISTER_ID=$(dfx canister id mintmymoment_frontend --network ic)

# Create production environment file
print_status "Creating production environment configuration..."
cat > .env.production << EOF
# Internet Computer Production Configuration
NEXT_PUBLIC_CANISTER_ID=$BACKEND_CANISTER_ID
NEXT_PUBLIC_IC_HOST=https://icp-api.io

# IPFS Configuration (Required for production)
NEXT_PUBLIC_PINATA_API_KEY=your-pinata-api-key
NEXT_PUBLIC_PINATA_SECRET_KEY=your-pinata-secret-key

# Environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://$FRONTEND_CANISTER_ID.icp0.io

# Production Settings
NEXT_PUBLIC_DFX_NETWORK=ic
EOF

echo ""
print_success "🎉 Production deployment completed!"
echo "=================================="
echo ""
echo "📋 Production Information:"
echo "Backend Canister ID: $BACKEND_CANISTER_ID"
echo "Frontend Canister ID: $FRONTEND_CANISTER_ID"
echo ""
echo "🌐 Live URLs:"
echo "Frontend: https://$FRONTEND_CANISTER_ID.icp0.io"
echo "Backend: https://$BACKEND_CANISTER_ID.icp0.io"
echo "Candid UI: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=$BACKEND_CANISTER_ID"
echo ""
echo "🔧 Next Steps for Vercel Deployment:"
echo "1. Push your code to GitHub"
echo "2. Connect your repository to Vercel"
echo "3. Set these environment variables in Vercel:"
echo "   NEXT_PUBLIC_CANISTER_ID=$BACKEND_CANISTER_ID"
echo "   NEXT_PUBLIC_IC_HOST=https://icp-api.io"
echo "   NEXT_PUBLIC_PINATA_API_KEY=<your-pinata-key>"
echo "   NEXT_PUBLIC_PINATA_SECRET_KEY=<your-pinata-secret>"
echo ""
echo "📝 Important Notes:"
echo "• Your smart contracts are now live on the Internet Computer"
echo "• Frontend can be accessed directly via IC or deployed to Vercel"
echo "• Set up IPFS (Pinata) keys for file uploads"
echo "• Monitor your canister cycles regularly"
echo ""
print_success "Your NFT platform is now live! 🚀"

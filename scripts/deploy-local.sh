#!/bin/bash

echo "🚀 MintMyMoment Local Deployment"
echo "================================"

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

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    print_error "dfx is not installed. Please install DFINITY SDK first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

print_status "Node.js version: $(node --version) ✓"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm version: $(npm --version) ✓"

# Install dependencies
print_status "Installing dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check if dfx is running
if ! dfx ping local &> /dev/null; then
    print_status "Starting local Internet Computer replica..."
    dfx start --background --clean
    
    # Wait for replica to start
    print_status "Waiting for replica to start..."
    sleep 10
    
    # Check if replica started successfully
    if ! dfx ping local &> /dev/null; then
        print_error "Failed to start local replica"
        print_status "Try running: dfx start --clean"
        exit 1
    fi
    
    print_success "Local replica started successfully"
else
    print_success "Local replica is already running"
fi

# Deploy canisters
print_status "Deploying canisters to local network..."
if dfx deploy --network local; then
    print_success "Canisters deployed successfully"
else
    print_error "Failed to deploy canisters"
    print_status "Check the error messages above and try again"
    exit 1
fi

# Get canister IDs
BACKEND_CANISTER_ID=$(dfx canister id mintmymoment_backend --network local 2>/dev/null)
FRONTEND_CANISTER_ID=$(dfx canister id mintmymoment_frontend --network local 2>/dev/null)

if [ -z "$BACKEND_CANISTER_ID" ]; then
    print_error "Failed to get backend canister ID"
    exit 1
fi

if [ -z "$FRONTEND_CANISTER_ID" ]; then
    print_error "Failed to get frontend canister ID"
    exit 1
fi

# Create or update .env.local file
print_status "Creating environment configuration..."
cat > .env.local << EOF
# Internet Computer Configuration
NEXT_PUBLIC_CANISTER_ID=$BACKEND_CANISTER_ID
NEXT_PUBLIC_IC_HOST=http://127.0.0.1:4943

# IPFS Configuration (Optional - for demo mode)
# NEXT_PUBLIC_PINATA_API_KEY=your-pinata-api-key
# NEXT_PUBLIC_PINATA_SECRET_KEY=your-pinata-secret-key

# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development Settings
NEXT_PUBLIC_DFX_NETWORK=local
EOF

print_success "Environment file created: .env.local"

# Build the frontend
print_status "Building frontend application..."
if npm run build; then
    print_success "Frontend built successfully"
else
    print_error "Failed to build frontend"
    exit 1
fi

echo ""
print_success "🎉 Local deployment completed successfully!"
echo "========================================"
echo ""
echo "📋 Deployment Information:"
echo "Backend Canister ID: $BACKEND_CANISTER_ID"
echo "Frontend Canister ID: $FRONTEND_CANISTER_ID"
echo ""
echo "🌐 Local URLs:"
echo "Frontend (Next.js): http://localhost:3000"
echo "Backend Canister: http://127.0.0.1:4943/?canisterId=$BACKEND_CANISTER_ID"
echo "Candid UI: http://127.0.0.1:4943/?canisterId=$(dfx canister id __Candid_UI --network local)&id=$BACKEND_CANISTER_ID"
echo ""
echo "🔧 Next Steps:"
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open your browser and visit:"
echo "   http://localhost:3000"
echo ""
echo "3. For production deployment, run:"
echo "   ./scripts/deploy-production.sh"
echo ""
echo "📝 Notes:"
echo "• The local replica is running in the background"
echo "• Your canisters are deployed and ready to use"
echo "• Environment variables are configured in .env.local"
echo "• Demo mode is active (no IPFS keys required for testing)"
echo ""
print_success "Happy minting! 🏆"

#!/bin/bash

echo "🚀 Deploying MintMyMoment to Vercel"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_status "Installing Vercel CLI..."
    npm install -g vercel
    
    if ! command -v vercel &> /dev/null; then
        print_error "Failed to install Vercel CLI"
        exit 1
    fi
    
    print_success "Vercel CLI installed successfully"
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_status "Please log in to Vercel..."
    vercel login
    
    if ! vercel whoami &> /dev/null; then
        print_error "Failed to log in to Vercel"
        exit 1
    fi
fi

VERCEL_USER=$(vercel whoami)
print_success "Logged in as: $VERCEL_USER"

# Check environment variables
if [ -z "$NEXT_PUBLIC_CANISTER_ID" ]; then
    print_warning "NEXT_PUBLIC_CANISTER_ID not set."
    print_status "Make sure to set this in Vercel dashboard after deployment."
fi

if [ -z "$NEXT_PUBLIC_PINATA_API_KEY" ]; then
    print_warning "NEXT_PUBLIC_PINATA_API_KEY not set."
    print_status "Make sure to set this in Vercel dashboard after deployment."
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build project
print_status "Building project..."
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
if vercel --prod; then
    print_success "Deployment to Vercel completed!"
else
    print_error "Deployment to Vercel failed"
    exit 1
fi

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls | grep mintmymoment | head -1 | awk '{print $2}')

echo ""
print_success "🎉 Vercel deployment completed!"
echo "=============================="
echo ""
echo "🌐 Your app is live at:"
echo "https://$DEPLOYMENT_URL"
echo ""
echo "🔧 Important: Set Environment Variables"
echo "======================================="
echo "Go to your Vercel dashboard and set these variables:"
echo ""
echo "1. NEXT_PUBLIC_CANISTER_ID"
echo "   Value: <your-backend-canister-id>"
echo ""
echo "2. NEXT_PUBLIC_IC_HOST"
echo "   Value: https://icp-api.io"
echo ""
echo "3. NEXT_PUBLIC_PINATA_API_KEY"
echo "   Value: <your-pinata-api-key>"
echo ""
echo "4. NEXT_PUBLIC_PINATA_SECRET_KEY"
echo "   Value: <your-pinata-secret-key>"
echo ""
echo "📝 Steps to set environment variables:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add each variable for Production environment"
echo "5. Redeploy your application"
echo ""
print_success "Your NFT platform frontend is now live on Vercel! 🌟"

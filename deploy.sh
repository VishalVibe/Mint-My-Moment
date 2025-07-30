#!/bin/bash

# Deploy to local network
echo "Deploying to local network..."
dfx start --background
dfx deploy --network local

# Get canister IDs
BACKEND_CANISTER_ID=$(dfx canister id mintmymoment_backend --network local)
FRONTEND_CANISTER_ID=$(dfx canister id mintmymoment_frontend --network local)

echo "Backend Canister ID: $BACKEND_CANISTER_ID"
echo "Frontend Canister ID: $FRONTEND_CANISTER_ID"

# Deploy to mainnet (uncomment when ready)
# echo "Deploying to mainnet..."
# dfx deploy --network ic --with-cycles 1000000000000

echo "Deployment complete!"

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";

actor MintMyMoment {
    
    // NFT data structure
    public type NFT = {
        id: Text;
        title: Text;
        description: Text;
        sport: Text;
        playerName: Text;
        eventDate: Text;
        imageUrl: Text;
        owner: Principal;
        creator: Principal;
        price: Nat;
        createdAt: Int;
    };

    // NFT metadata for minting
    public type NFTMetadata = {
        title: Text;
        description: Text;
        sport: Text;
        playerName: Text;
        eventDate: Text;
        imageUrl: Text;
        price: Nat;
    };

    // Storage
    private stable var nextNFTId: Nat = 1;
    private var nfts = HashMap.HashMap<Text, NFT>(10, Text.equal, Text.hash);
    private var userNFTs = HashMap.HashMap<Principal, [Text]>(10, Principal.equal, Principal.hash);

    // Mint a new NFT
    public shared(msg) func mintNFT(metadata: NFTMetadata) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        let nftId = "nft_" # Nat.toText(nextNFTId);
        
        let nft: NFT = {
            id = nftId;
            title = metadata.title;
            description = metadata.description;
            sport = metadata.sport;
            playerName = metadata.playerName;
            eventDate = metadata.eventDate;
            imageUrl = metadata.imageUrl;
            owner = caller;
            creator = caller;
            price = metadata.price;
            createdAt = Time.now();
        };

        nfts.put(nftId, nft);
        
        // Update user's NFT list
        let currentUserNFTs = switch (userNFTs.get(caller)) {
            case null { [] };
            case (?nftList) { nftList };
        };
        let updatedUserNFTs = Array.append(currentUserNFTs, [nftId]);
        userNFTs.put(caller, updatedUserNFTs);
        
        nextNFTId += 1;
        #ok(nftId)
    };

    // Get all NFTs
    public query func getAllNFTs() : async [NFT] {
        Iter.toArray(nfts.vals())
    };

    // Get NFTs owned by a specific user
    public query func getUserNFTs(user: Principal) : async [NFT] {
        switch (userNFTs.get(user)) {
            case null { [] };
            case (?nftIds) {
                let userNFTList = Array.mapFilter<Text, NFT>(nftIds, func(id) {
                    nfts.get(id)
                });
                userNFTList
            };
        }
    };

    // Transfer NFT ownership
    public shared(msg) func transferNFT(nftId: Text, to: Principal) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (nfts.get(nftId)) {
            case null { #err("NFT not found") };
            case (?nft) {
                if (nft.owner != caller) {
                    return #err("You don't own this NFT");
                };

                // Update NFT ownership
                let updatedNFT: NFT = {
                    id = nft.id;
                    title = nft.title;
                    description = nft.description;
                    sport = nft.sport;
                    playerName = nft.playerName;
                    eventDate = nft.eventDate;
                    imageUrl = nft.imageUrl;
                    owner = to;
                    creator = nft.creator;
                    price = nft.price;
                    createdAt = nft.createdAt;
                };
                nfts.put(nftId, updatedNFT);

                // Remove from current owner's list
                let currentOwnerNFTs = switch (userNFTs.get(caller)) {
                    case null { [] };
                    case (?nftList) { nftList };
                };
                let filteredOwnerNFTs = Array.filter<Text>(currentOwnerNFTs, func(id) { id != nftId });
                userNFTs.put(caller, filteredOwnerNFTs);

                // Add to new owner's list
                let newOwnerNFTs = switch (userNFTs.get(to)) {
                    case null { [] };
                    case (?nftList) { nftList };
                };
                let updatedNewOwnerNFTs = Array.append(newOwnerNFTs, [nftId]);
                userNFTs.put(to, updatedNewOwnerNFTs);

                #ok(())
            };
        }
    };

    // Buy NFT (simplified - in production would handle ICP transfers)
    public shared(msg) func buyNFT(nftId: Text) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (nfts.get(nftId)) {
            case null { #err("NFT not found") };
            case (?nft) {
                if (nft.owner == caller) {
                    return #err("You already own this NFT");
                };

                // In a real implementation, you would:
                // 1. Verify ICP payment
                // 2. Transfer ICP to current owner
                // 3. Transfer NFT ownership

                // For now, just transfer ownership
                let result = await transferNFT(nftId, caller);
                switch (result) {
                    case (#ok()) { #ok(()) };
                    case (#err(msg)) { #err(msg) };
                }
            };
        }
    };

    // Get NFT by ID
    public query func getNFT(nftId: Text) : async ?NFT {
        nfts.get(nftId)
    };

    // Get total number of NFTs
    public query func getTotalNFTs() : async Nat {
        nfts.size()
    };

    // System functions for upgrades
    system func preupgrade() {
        // Convert HashMaps to stable arrays before upgrade
    };

    system func postupgrade() {
        // Restore HashMaps from stable arrays after upgrade
    };
}

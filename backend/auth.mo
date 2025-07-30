import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Result "mo:base/Result";

actor Auth {
    
    // User roles
    public type Role = {
        #User;
        #Moderator;
        #Admin;
    };

    // User permissions
    public type Permission = {
        #MintNFT;
        #BuyNFT;
        #TransferOwnNFT;
        #ModerateContent;
        #ViewReports;
        #SuspendUsers;
        #AdminDashboard;
        #ManageUsers;
        #ManagePlatform;
        #ViewAnalytics;
        #ModerateAllContent;
        #SystemSettings;
    };

    // User profile
    public type UserProfile = {
        principal: Principal;
        role: Role;
        permissions: [Permission];
        isVerified: Bool;
        createdAt: Int;
        lastActive: Int;
    };

    // Storage
    private var users = HashMap.HashMap<Principal, UserProfile>(10, Principal.equal, Principal.hash);
    private var admins = HashMap.HashMap<Principal, Bool>(5, Principal.equal, Principal.hash);
    private var moderators = HashMap.HashMap<Principal, Bool>(10, Principal.equal, Principal.hash);

    // Initialize with default admin (replace with your principal)
    private func initializeAdmins() {
        // Add your admin principal here - replace with your actual principal
        let adminPrincipal = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        admins.put(adminPrincipal, true);
    };

    // Get user permissions based on role
    private func getPermissions(role: Role) : [Permission] {
        switch (role) {
            case (#User) {
                [#MintNFT, #BuyNFT, #TransferOwnNFT]
            };
            case (#Moderator) {
                [#MintNFT, #BuyNFT, #TransferOwnNFT, #ModerateContent, #ViewReports, #SuspendUsers]
            };
            case (#Admin) {
                [#MintNFT, #BuyNFT, #TransferOwnNFT, #ModerateContent, #ViewReports, #SuspendUsers, 
                 #AdminDashboard, #ManageUsers, #ManagePlatform, #ViewAnalytics, #ModerateAllContent, #SystemSettings]
            };
        }
    };

    // Get user role
    private func getUserRole(caller: Principal) : Role {
        switch (admins.get(caller)) {
            case (?true) { #Admin };
            case _ {
                switch (moderators.get(caller)) {
                    case (?true) { #Moderator };
                    case _ { #User };
                }
            };
        }
    };

    // Register or get user profile
    public shared(msg) func getUserProfile() : async UserProfile {
        let caller = msg.caller;
        
        switch (users.get(caller)) {
            case (?profile) { profile };
            case null {
                let role = getUserRole(caller);
                let profile: UserProfile = {
                    principal = caller;
                    role = role;
                    permissions = getPermissions(role);
                    isVerified = true;
                    createdAt = 0; // You would use Time.now() here
                    lastActive = 0;
                };
                users.put(caller, profile);
                profile
            };
        }
    };

    // Check if user has specific permission
    public shared(msg) func hasPermission(permission: Permission) : async Bool {
        let caller = msg.caller;
        let profile = await getUserProfile();
        
        Array.find<Permission>(profile.permissions, func(p) { p == permission }) != null
    };

    // Admin function: Add moderator
    public shared(msg) func addModerator(userPrincipal: Principal) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        // Check if caller is admin
        switch (admins.get(caller)) {
            case (?true) {
                moderators.put(userPrincipal, true);
                
                // Update user profile if exists
                switch (users.get(userPrincipal)) {
                    case (?profile) {
                        let updatedProfile: UserProfile = {
                            principal = profile.principal;
                            role = #Moderator;
                            permissions = getPermissions(#Moderator);
                            isVerified = profile.isVerified;
                            createdAt = profile.createdAt;
                            lastActive = profile.lastActive;
                        };
                        users.put(userPrincipal, updatedProfile);
                    };
                    case null { /* User will get moderator role when they first interact */ };
                };
                
                #ok(())
            };
            case _ { #err("Only admins can add moderators") };
        }
    };

    // Admin function: Remove moderator
    public shared(msg) func removeModerator(userPrincipal: Principal) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        // Check if caller is admin
        switch (admins.get(caller)) {
            case (?true) {
                moderators.delete(userPrincipal);
                
                // Update user profile if exists
                switch (users.get(userPrincipal)) {
                    case (?profile) {
                        let updatedProfile: UserProfile = {
                            principal = profile.principal;
                            role = #User;
                            permissions = getPermissions(#User);
                            isVerified = profile.isVerified;
                            createdAt = profile.createdAt;
                            lastActive = profile.lastActive;
                        };
                        users.put(userPrincipal, updatedProfile);
                    };
                    case null { /* User will get user role when they first interact */ };
                };
                
                #ok(())
            };
            case _ { #err("Only admins can remove moderators") };
        }
    };

    // Get all users (admin only)
    public shared(msg) func getAllUsers() : async Result.Result<[UserProfile], Text> {
        let caller = msg.caller;
        
        switch (admins.get(caller)) {
            case (?true) {
                let userProfiles = users.vals();
                #ok(Iter.toArray(userProfiles))
            };
            case _ { #err("Only admins can view all users") };
        }
    };

    // Check if user is admin
    public query func isAdmin(userPrincipal: Principal) : async Bool {
        switch (admins.get(userPrincipal)) {
            case (?true) { true };
            case _ { false };
        }
    };

    // Check if user is moderator
    public query func isModerator(userPrincipal: Principal) : async Bool {
        switch (moderators.get(userPrincipal)) {
            case (?true) { true };
            case _ { false };
        }
    };

    // Initialize on deployment
    system func preupgrade() {
        // Save state before upgrade
    };

    system func postupgrade() {
        // Restore state after upgrade
        initializeAdmins();
    };
}

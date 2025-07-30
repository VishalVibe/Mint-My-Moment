import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { WalletProvider } from "@/hooks/use-wallet"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MintMyMoment - DeFi NFT Sports Platform",
  description: "Transform iconic sports moments into unique NFTs on the Internet Computer Protocol",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <WalletProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster
              theme="dark"
              position="top-right"
              toastOptions={{
                style: {
                  background: "#1f2937",
                  border: "1px solid #374151",
                  color: "#f9fafb",
                },
              }}
            />
          </AuthProvider>
        </WalletProvider>
      </body>
    </html>
  )
}

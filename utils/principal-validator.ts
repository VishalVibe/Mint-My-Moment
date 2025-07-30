import { Principal } from "@dfinity/principal"

/**
 * Validates if a string is a valid Principal ID
 */
export function isValidPrincipal(principalText: string): boolean {
  try {
    Principal.fromText(principalText)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Safely creates a Principal from text with error handling
 */
export function safePrincipalFromText(principalText: string): Principal | null {
  try {
    return Principal.fromText(principalText)
  } catch (error) {
    console.error(`Invalid Principal ID: ${principalText}`, error)
    return null
  }
}

/**
 * Formats a Principal ID for display (truncated)
 */
export function formatPrincipal(principal: string | Principal, length = 8): string {
  const principalText = typeof principal === "string" ? principal : principal.toString()

  if (principalText.length <= length * 2) {
    return principalText
  }

  return `${principalText.slice(0, length)}...${principalText.slice(-length)}`
}

/**
 * Common valid Principal IDs for demo purposes
 */
export const DEMO_PRINCIPALS = {
  ADMIN: "rrkah-fqaaa-aaaaa-aaaaq-cai",
  USER1: "rdmx6-jaaaa-aaaah-qcaiq-cai",
  USER2: "rno2w-sqaaa-aaaah-qcaiq-cai",
  USER3: "renrk-eyaaa-aaaaa-aaada-cai",
  USER4: "ryjl3-tyaaa-aaaaa-aaaba-cai",
  USER5: "rkp4c-7iaaa-aaaaa-aaaca-cai",
}

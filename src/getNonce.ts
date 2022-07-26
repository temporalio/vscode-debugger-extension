import crypto from "crypto"

export function getNonce(): string {
  const nonce = crypto.randomUUID()

  return nonce
}

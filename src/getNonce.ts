import crypto from "crypto"

export function getNonce(): string {
  return crypto.randomUUID()
}

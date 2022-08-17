import { ExtensionContext, SecretStorage } from "vscode"

export default class AuthSettings {
  private static _instance: AuthSettings

  constructor(private secretStorage: SecretStorage) {}

  static init(context: ExtensionContext): void {
    AuthSettings._instance = new AuthSettings(context.secrets)
  }

  static get instance(): AuthSettings {
    return AuthSettings._instance
  }

  async storeAuthData(key: string, token?: string): Promise<void> {
    if (token) {
      await this.secretStorage.store(key, token)
    }
  }

  async getAuthData(key: string): Promise<string | undefined> {
    return await this.secretStorage.get(key)
  }

  async deleteAuthData(key: string): Promise<void> {
    await this.secretStorage.delete(key)
  }
}

import * as api from "./gen" // <- This imports all endpoint functions
import { authenticate } from "./gen"

interface VouchsafeClientOptions {
  clientId: string
  clientSecret: string
}

type ApiMethod = keyof typeof api

export class VouchsafeClient {
  private clientId: string
  private clientSecret: string
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor({ clientId, clientSecret }: VouchsafeClientOptions) {
    this.clientId = clientId
    this.clientSecret = clientSecret

    return new Proxy(this, {
      get: (target, prop: string, receiver) => {
        if (typeof prop !== "string") return Reflect.get(target, prop, receiver)
        if (typeof (api as any)[prop] === "function") {
          return async (args: any = {}) => {
            await target.ensureAuthenticated()
            return (api as any)[prop]({
              ...args,
              auth: target.accessToken!,
            })
          }
        }

        return Reflect.get(target, prop, receiver)
      },
    })
  }

  private async ensureAuthenticated() {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry)
      return

    const res = await authenticate({
      body: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
      },
    })

    this.accessToken = res.data?.access_token ?? null
    this.tokenExpiry = res.data?.expires_at
      ? new Date(res.data.expires_at)
      : null

    if (!this.accessToken) {
      throw new Error("Failed to obtain access token")
    }
  }
}

// Pull all generated endpoint functions from the SDK file
import * as api from "./gen/sdk.gen"

interface VouchsafeClientOptions {
  clientId: string
  clientSecret: string
}

// 1) Pick only function exports from the generated module
type ApiFns = {
  [K in keyof typeof api as (typeof api)[K] extends (...args: any[]) => any
    ? K
    : never]: (typeof api)[K]
}

// 2) Remove `auth` from the first (object) arg if present
type StripAuth<P> = P extends [{ auth?: unknown } & infer R]
  ? [Omit<R, "auth">]
  : P extends [infer Only]
  ? [Only]
  : []

// 3) Public, typed surface we want on the client
type ClientApi = {
  [K in keyof ApiFns]: (
    ...args: StripAuth<Parameters<ApiFns[K]>>
  ) => ReturnType<ApiFns[K]>
}

// 4) Forward-declare the merged interface
export interface VouchsafeClient extends ClientApi {}

// 5) Base class with Proxy and auth
class VouchsafeClientBase {
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor(private opts: VouchsafeClientOptions) {
    return new Proxy(this as unknown as VouchsafeClient, {
      get: (target, prop, receiver) => {
        if (typeof prop !== "string")
          return Reflect.get(target as object, prop, receiver)
        if ((target as any)[prop] !== undefined)
          return Reflect.get(target as object, prop, receiver)

        const fn = (api as Record<string, unknown>)[prop]
        if (typeof fn === "function") {
          return async (...args: any[]) => {
            await (target as VouchsafeClientBase).ensureAuthenticated()
            const first = args[0] ?? {}
            if (first && typeof first === "object") {
              return (fn as Function)({
                ...first,
                auth: (target as VouchsafeClientBase).accessToken!,
              })
            }
            return (fn as Function)({
              auth: (target as VouchsafeClientBase).accessToken!,
            })
          }
        }

        return Reflect.get(target as object, prop, receiver)
      },
    })
  }

  private async ensureAuthenticated() {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry)
      return

    const res = await api.authenticate({
      body: {
        client_id: this.opts.clientId,
        client_secret: this.opts.clientSecret,
      },
    })

    this.accessToken = res.data?.access_token ?? null
    this.tokenExpiry = res.data?.expires_at
      ? new Date(res.data.expires_at)
      : null

    if (!this.accessToken) throw new Error("Failed to obtain access token")
  }
}

// 6) Public class to `new` up
export class VouchsafeClient extends VouchsafeClientBase {}

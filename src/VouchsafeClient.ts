import { Configuration } from "./openapi"
import { AuthenticationApi } from "./openapi/apis/AuthenticationApi"
import { VerificationsApi } from "./openapi/apis/VerificationsApi"
import { SmartLookupsApi } from "./openapi/apis/SmartLookupsApi"
import {
  AuthenticateRequestBody,
  AuthenticateResponse,
  Status,
} from "./openapi/models"

interface VouchsafeClientOptions {
  clientId: string
  clientSecret: string
  sandbox?: boolean
}

export class VouchsafeClient {
  private token?: string
  private tokenExpiry?: Date
  private config: Configuration

  private authenticationApi: AuthenticationApi
  private verificationsApi: VerificationsApi
  private smartLookupsApi: SmartLookupsApi

  constructor(private options: VouchsafeClientOptions) {
    const basePath = options.sandbox
      ? "https://app.vouchsafe.id/api/v1/sandbox"
      : "https://app.vouchsafe.id/api/v1"

    this.config = new Configuration({
      basePath,
      accessToken: this.getAccessToken,
    })

    this.authenticationApi = new AuthenticationApi(this.config)
    this.verificationsApi = new VerificationsApi(this.config)
    this.smartLookupsApi = new SmartLookupsApi(this.config)
  }

  private getAccessToken = async (): Promise<string> => {
    const now = new Date()

    if (this.token && this.tokenExpiry && now < this.tokenExpiry) {
      return this.token
    }

    const authBody: AuthenticateRequestBody = {
      clientId: this.options.clientId,
      clientSecret: this.options.clientSecret,
    }

    const response = await this.authenticationApi.authenticate({
      authenticateRequestBody: authBody,
    })

    this.token = response.accessToken
    this.tokenExpiry = new Date(response.expiresAt)

    return this.token
  }

  // Public API methods

  async getVerification(id: string) {
    return this.verificationsApi.getVerification({ id })
  }

  async listVerifications(status?: Status) {
    return this.verificationsApi.listVerifications({
      status,
    })
  }

  async requestVerification(
    params: Parameters<VerificationsApi["requestVerification"]>[0]
  ) {
    return this.verificationsApi.requestVerification(params)
  }

  async performSmartLookup(
    params: Parameters<SmartLookupsApi["performSmartLookup"]>[0]
  ) {
    return this.smartLookupsApi.performSmartLookup(params)
  }

  async searchPostcode(postcode: string) {
    return this.smartLookupsApi.searchPostcode({ postcode })
  }
}

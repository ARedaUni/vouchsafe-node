import { Configuration } from "./openapi"
import { AuthenticationApi } from "./openapi/apis/AuthenticationApi"
import { VerificationsApi } from "./openapi/apis/VerificationsApi"
import { SmartLookupsApi } from "./openapi/apis/SmartLookupsApi"
import {
  AuthenticateRequestBody,
  RequestVerificationRequestBody,
  SmartLookupInput,
  Status,
} from "./openapi/models"
// Above are all generated files from openapi-generator

interface VouchsafeClientOptions {
  client_id: string
  client_secret: string
  sandbox?: boolean
}

export class VouchsafeApiError extends Error {
  constructor(
    public statusCode: number,
    public responseBody: unknown,
    message?: string
  ) {
    super(message)
    this.name = "VouchsafeApiError"
  }
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

  /**
   * PRIVATE METHODS
   *
   * To simplify interacting with the API
   */

  // Handle token expiration and pass into every request
  private getAccessToken = async (): Promise<string> => {
    const now = new Date()
    const bufferMs = 5 * 60 * 1000 // 5 minutes

    if (
      this.token &&
      this.tokenExpiry &&
      now.getTime() < this.tokenExpiry.getTime() - bufferMs
    ) {
      return this.token
    }

    const authBody: AuthenticateRequestBody = {
      client_id: this.options.client_id,
      client_secret: this.options.client_secret,
    }

    const response = await this.authenticationApi.authenticate({
      authenticateRequestBody: authBody,
    })

    this.token = response.access_token
    this.tokenExpiry = new Date(response.expires_at)

    return this.token
  }

  // Wrap raw fetch response errors and provide something cleaner
  private withErrorHandling = async <T>(promise: Promise<T>): Promise<T> => {
    try {
      return await promise
    } catch (err: any) {
      if (err.name === "ResponseError" && err.response instanceof Response) {
        const body = await err.response.json().catch(() => ({}))
        const message = body?.message ?? err.response.statusText
        throw new VouchsafeApiError(err.response.status, body, message)
      }

      throw err
    }
  }

  /**
   * PUBLIC METHODS
   *
   * One for every endpoint we expose
   */

  async getVerification({ id }: { id: string }) {
    return this.withErrorHandling(this.verificationsApi.getVerification({ id }))
  }

  async listVerifications({ status }: { status?: Status } = {}) {
    return this.withErrorHandling(
      this.verificationsApi.listVerifications({ status })
    )
  }

  async requestVerification(input: RequestVerificationRequestBody) {
    return this.withErrorHandling(
      this.verificationsApi.requestVerification({
        requestVerificationRequestBody: input,
      })
    )
  }

  async performSmartLookup(input: SmartLookupInput) {
    return this.withErrorHandling(
      this.smartLookupsApi.performSmartLookup({
        smartLookupInput: input,
      })
    )
  }

  async searchPostcode({ postcode }: { postcode: string }) {
    return this.withErrorHandling(
      this.smartLookupsApi.searchPostcode({ postcode })
    )
  }

  // Add more endpoints here...
}

# Vouchsafe Node.js library

The Vouchsafe Node library provides convenient, typed access to the Vouchsafe API for applications written in server-side JavaScript.

## Requirements

Node 18 or better.

## Installation

```
npm install @vouchsafe/node
# or
yarn add  @vouchsafe/node
```

## Usage

The SDK needs a client ID and secret, which is available in the [Vouchsafe dashboard](https://app.vouchsafe.id). Replace the values below:

```ts
import { VouchsafeClient } from "@vouchsafe/node"

const client = new VouchsafeClient({
  client_id: "YOUR_CLIENT_ID",
  client_secret: "YOUR_CLIENT_SECRET",
})

// Request a verification
const res = await client.requestVerification({
  email: "foo@bar.com",
})

console.log(res.id) // Trackable verification session ID
console.log(res.url) // Redirect the user here
```

### List verifications

```ts
const res = await client.listVerifications({
  status: "InProgress", // Or any other supported status
})
```

### Get a specific verification

```ts
const res = await client.getVerification({
  id: "ID",
})
```

### List verification flows

```ts
const res = await client.listFlows()
```

### Sandbox mode

Use a sandbox rather than a live client secret to activate [sandbox mode](https://help.vouchsafe.id/en/articles/11979598-how-does-sandbox-mode-work) on methods that support it.

### Re-authentication

The client will automatically cache your access token and insert it into every request, and fetch a new one upon expiry.

If a request fails with a 401 Unauthorised error, it will fetch a new access token and retry once before throwing an error.

#### Multi-instance use

For best performance, you should instantiate the client once and share it across your app as a [singleton](https://www.patterns.dev/vanilla/singleton-pattern/).

Each time a new access token is requested using the same client credentials, it invalidates the old one.

Instantiating multiple clients can lead to:

- over-writing each other's tokens
- unnecessary retries and re-authentications.

For high-concurrency use cases, you should store the access token in a shared key-value store instead.

### Handling errors

Client methods will throw an instance of `VouchsafeApiError` if the API returns a bad response.

You can catch them like this:

```ts
try {
  const res = await client.getVerification({
    id: "non-existent",
  })
} catch (err) {
  if (err instanceof VouchsafeApiError) {
    console.log(err.statusCode, err.message)
  }
}
```

## Development

**[See the contribution guidelines for this project](https://github.com/vouchsafe/vouchsafe-node/blob/main/CONTRIBUTING.md)**

Contributions including issues and pull requests are welcome.

To run the project locally, clone the repo and run:

```bash
npm install
npm run generate # regenerate from API spec
npm run build # compile typescript
```

## Further reading

- [Developer docs](https://help.vouchsafe.id/en/collections/12439003-developers)
- [Full API endpoint reference](https://app.vouchsafe.id/docs)
- [3-minute video guide](https://www.youtube.com/playlist?list=PLx6V6SSTMuF_ZNWBPnysvwmdIwboLViE8)

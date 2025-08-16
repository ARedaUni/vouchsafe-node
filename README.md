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
import { VouchsafeClient } from " @vouchsafe/node"

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

### Sandbox mode

1. Add `sandbox: true` when instantiating the client
2. Use a sandbox client secret.

### Expiring access tokens

The client will automatically store your access token and insert it into every request, and fetch a new one upon expiry.

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

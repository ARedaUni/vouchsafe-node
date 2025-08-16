# Vouchsafe Node.js SDK

The Vouchsafe Node SDK provides convenient, typed access to the Vouchsafe API for applications written in server-side JavaScript.

## Requirements

Node 18 or better.

## Installation

```
npm install vouchsafe
# or
yarn add vouchsafe
```

## Usage

The SDK needs a client ID and secret, which is available in the [Vouchsafe dashboard](https://app.vouchsafe.id). Replace the values below:

```ts
import vouchsafe from "vouchsafe"

async function run() {
  // 1. Get an access token
  const res = await vouchsafe.authenticate({
    body: {
      // From the Vouchsafe dashboard
      client_id: "CLIENT_ID",
      client_secret: "CLIENT_SECRET",
    },
  })

  const access_token = res.data?.access_token // Store for future requests

  // 2. Call the API
  const res2 = await vouchsafe.requestVerification({
    body: {
      email: "foo@bar.com",
    },
    auth: access_token,
  })

  const id = res2.data?.id // Trackable ID for the requested verification
}
```

### Sandbox mode

## Further reading

- [Developer docs](https://help.vouchsafe.id/en/collections/12439003-developers)
- [Full API endpoint reference](https://app.vouchsafe.id/docs)
- [3-minute video guide](https://www.youtube.com/playlist?list=PLx6V6SSTMuF_ZNWBPnysvwmdIwboLViE8)
-

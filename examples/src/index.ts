import { VouchsafeApiClient } from '@vouchsafe/node';

(async () => {
  const client = new VouchsafeApiClient({ token: 'YOUR_TOKEN' });
  await client.v1.verifications.list({
    status: 'InProgress',
  });
})();

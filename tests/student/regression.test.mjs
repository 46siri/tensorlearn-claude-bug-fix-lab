import test from 'node:test';
import assert from 'node:assert/strict';
import { getClaim } from '../../src/claims.mjs';

// Incident (docs/contract.md): signed-in viewer `user-4` received `claim-B`,
// which belongs to `user-42`. Ownership must be an exact match on the
// normalized ownerId, never a prefix match.

test('viewer user-4 must not receive claim-B owned by user-42', () => {
  const claims = [{ id: 'claim-B', ownerId: 'user-42', status: 'pending' }];
  assert.equal(getClaim(claims, 'user-4', 'claim-B'), null);
});

test('the real owner still receives claim-B', () => {
  const claim = { id: 'claim-B', ownerId: 'user-42', status: 'pending' };
  assert.deepEqual(getClaim([claim], 'user-42', 'claim-B'), claim);
});

test('collision does not leak in the other direction either', () => {
  const claims = [{ id: 'claim-C', ownerId: 'user-4', status: 'open' }];
  assert.equal(getClaim(claims, 'user-42', 'claim-C'), null);
});

test('whitespace is trimmed but does not create a match', () => {
  const claims = [{ id: 'claim-B', ownerId: ' user-42 ', status: 'pending' }];
  assert.equal(getClaim(claims, ' user-4 ', ' claim-B '), null);
});

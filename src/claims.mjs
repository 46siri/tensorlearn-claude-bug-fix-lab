// Contract: docs/contract.md. Pure function; do not mutate claims.
export function getClaim(claims, viewerId, claimId) {
  // Only real strings are IDs: no coercion of numbers, objects, null or booleans.
  const normalize = value => (typeof value === 'string' ? value.trim() : '');
  if (!Array.isArray(claims)) return null;
  const target = normalize(claimId);
  const viewer = normalize(viewerId);
  if (target === '' || viewer === '') return null;
  // Both sides must match exactly; a prefix match leaks claims between owners.
  return claims.find(claim =>
    claim != null &&
    normalize(claim.id) === target &&
    normalize(claim.ownerId) === viewer
  ) ?? null;
}

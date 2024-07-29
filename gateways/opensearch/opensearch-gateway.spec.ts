/**
 * Copilot Input
 *
 * Write a file with name opensearch-gateway.ts
 * which builds on test case opensearch-gateway.spec.ts and
 * writes a concrete implementation that has access to OpenSearch.
 */

describe("OpenSearchGateway", () => {
  const openSearchGateway = new OpenSearchGateway();
  it("should be defined", () => {
    const indexExists = await openSearchGateway.indexExists();

    expect(indexExists).toBeTruthy();
  });
});

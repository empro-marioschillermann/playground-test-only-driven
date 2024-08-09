/**
 * Copilot Input
 *
 * Write a file with name opensearch-gateway.ts
 * which builds on test case opensearch-gateway.spec.ts and
 * writes a concrete implementation that has access to OpenSearch.
 */

import { mockDeep } from "jest-mock-extended";
import { Client } from "@opensearch-project/opensearch";
import { OpenSearchGateway } from "./opensearch-gateway";

describe("OpenSearchGateway", () => {
  type Entity = {};
  const openSearchClient = mockDeep<Client>();
  const openSearchGateway = new OpenSearchGateway<Entity>(openSearchClient);

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe("indexExists", () => {
    it("should find index", async () => {
      // stubs
      openSearchClient.indices.exists.mockResolvedValue({
        body: true,
      } as never);

      // when
      const indexExists = await openSearchGateway.indexExists("test-index");

      // then
      expect(indexExists).toBeTruthy();
    });

    it("should not find index", async () => {
      // stubs
      openSearchClient.indices.exists.mockResolvedValue({
        body: false,
      } as never);

      // when
      const indexExists = await openSearchGateway.indexExists("test-index");

      // then
      expect(indexExists).toBeFalsy();
    });

    it("should handle error", async () => {
      // stubs
      openSearchClient.indices.exists.mockRejectedValue(
        new Error("Error") as never
      );

      // when & then
      await expect(
        openSearchGateway.indexExists("invalid-index")
      ).rejects.toThrow(Error);
    });
  });

  describe("getEntryById", () => {
    type MyDocument = {
      title: string;
      content: string;
    };
    it("should get an entry by ID", async () => {
      openSearchClient.get.mockResolvedValue({
        body: {
          _id: "1",
          _source: { title: "My Title", content: "My Content" },
        },
      } as never);
      const entry = await openSearchGateway.getEntryById("test-index", "1");
      expect(entry).toStrictEqual({ title: "My Title", content: "My Content" });
    });

    it("should handle error", async () => {
      // stubs
      openSearchClient.get.mockRejectedValue(new Error("Error") as never);

      // when & then
      await expect(
        openSearchGateway.getEntryById("invalid-index", "1")
      ).rejects.toThrow(Error);
    });
  });
});

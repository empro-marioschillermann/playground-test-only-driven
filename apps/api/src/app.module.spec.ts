import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OpenSearchGateway } from "../../../gateways/opensearch/opensearch-gateway";
import { Client } from "@opensearch-project/opensearch";
import { AppModule } from "./app.module";

describe("AppModule", () => {
  let appModule: TestingModule;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it("should be defined", () => {
    expect(appModule).toBeDefined();
  });

  it("should provide AppController", () => {
    const appController = appModule.get<AppController>(AppController);
    expect(appController).toBeInstanceOf(AppController);
  });

  it("should provide AppService", () => {
    const appService = appModule.get<AppService>(AppService);
    expect(appService).toBeInstanceOf(AppService);
  });

  it("should provide OpenSearchGateway", () => {
    const openSearchGateway =
      appModule.get<OpenSearchGateway<Document>>(OpenSearchGateway);
    expect(openSearchGateway).toBeInstanceOf(OpenSearchGateway);
  });

  it("should provide OpenSearch Client", () => {
    const client = appModule.get<Client>(Client);

    expect(client).toBeInstanceOf(Client);
    expect(client.connectionPool.connections[0].url.href).toBe(
      "http://localhost:9200/"
    );
  });
});

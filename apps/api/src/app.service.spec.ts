import { Test, TestingModule } from "@nestjs/testing";
import { AppService, Document } from "./app.service";
import { OpenSearchGateway } from "../../../gateways/opensearch/opensearch-gateway";
import { mock } from "jest-mock-extended";

describe("AppService", () => {
  const openSearchGateway = mock<OpenSearchGateway>();
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: OpenSearchGateway,
          useValue: openSearchGateway,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it("should return a document by id", async () => {
    // stubs
    const document: Document = {
      uuid: "e41512bc-f298-4304-920c-9f2481e00434",
      title: "Document 1",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    };
    openSearchGateway.getEntryById.mockResolvedValue(document);

    // when
    const documentResult = await service.getDocument(
      "e41512bc-f298-4304-920c-9f2481e00434"
    );

    // then
    expect(openSearchGateway.getEntryById).toHaveBeenNthCalledWith(
      1,
      "index",
      "e41512bc-f298-4304-920c-9f2481e00434"
    );

    expect(documentResult).toStrictEqual({
      uuid: "e41512bc-f298-4304-920c-9f2481e00434",
      title: "Document 1",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    });
  });
});

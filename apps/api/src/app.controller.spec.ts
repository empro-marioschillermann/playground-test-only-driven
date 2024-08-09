import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService, Document } from "./app.service";
import { mock } from "jest-mock-extended";

describe("AppController", () => {
  let appController: AppController;
  const appService = mock<AppService>();

  beforeEach(async () => {
    jest.resetAllMocks();
    const document: Document = {
      uuid: "e41512bc-f298-4304-920c-9f2481e00434",
      title: "Document 1",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appService,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe("getDocument", () => {
    it("should return a document", async () => {
      const document: Document = {
        uuid: "e41512bc-f298-4304-920c-9f2481e00434",
        title: "Document 1",
        content:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      };
      appService.getDocument.mockResolvedValue(document);

      const result = await appController.getDocument(
        "e41512bc-f298-4304-920c-9f2481e00434"
      );

      expect(appService.getDocument).toHaveBeenNthCalledWith(
        1,
        "e41512bc-f298-4304-920c-9f2481e00434"
      );
      expect(result).toBe(document);
    });
  });
});

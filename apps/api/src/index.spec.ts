import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createServer, proxy } from "aws-serverless-express";
import { Context } from "aws-lambda";
import { handler, bootstrapServer } from "./index";

jest.mock("@nestjs/core", () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      init: jest.fn().mockResolvedValue(undefined),
      getHttpAdapter: jest.fn().mockReturnValue({
        getInstance: jest.fn().mockReturnValue({}),
      }),
    }),
  },
}));

jest.mock("aws-serverless-express", () => ({
  createServer: jest.fn().mockReturnValue({}),
  proxy: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({}),
  }),
}));

describe("bootstrapServer", () => {
  it("should initialize the NestJS application and return a server", async () => {
    const server = await bootstrapServer();
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(server).toBeDefined();
    expect(createServer).toHaveBeenCalled();
  });
});

describe("handler", () => {
  let event: any;
  let context: Context;

  beforeEach(() => {
    event = {};
    context = {} as Context;
  });

  it("should bootstrap the server if not cached and proxy the request", async () => {
    const result = await handler(event, context);
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(createServer).toHaveBeenCalled();
    expect(proxy).toHaveBeenCalledWith(
      expect.anything(),
      event,
      context,
      "PROMISE"
    );
    expect(result).toBeDefined();
  });

  it("should use the cached server if available and proxy the request", async () => {
    await handler(event, context); // First call to initialize cachedServer
    const result = await handler(event, context); // Second call should use cachedServer
    expect(NestFactory.create).toHaveBeenCalledTimes(1); // Should not create again
    expect(proxy).toHaveBeenCalledWith(
      expect.anything(),
      event,
      context,
      "PROMISE"
    );
    expect(result).toBeDefined();
  });
});

import { context } from "@opentelemetry/api";
import { AsyncHooksContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { Resource } from "@opentelemetry/resources";
import {
  BasicTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { PrismaInstrumentation } from "@prisma/instrumentation";

const contextManager = new AsyncHooksContextManager().enable();

context.setGlobalContextManager(contextManager);

const otlpTraceExporter = new OTLPTraceExporter();

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "test-tracing-service",
    [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
  }),
});

provider.addSpanProcessor(new SimpleSpanProcessor(otlpTraceExporter));
provider.register();

registerInstrumentations({
  instrumentations: [new PrismaInstrumentation()],
});

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const createMany = (n: number) => {
  return new Array(n)
    .fill({
      email: " ",
      name: " ",
    })
    .map((item) => ({
      name: (Math.random() * 100).toString(),
      email: (Math.random() * 100).toString(),
    }));
};

const main = async () => {
  const creates2 = createMany(2);
  const creates20 = createMany(20);
  const creates100 = createMany(100);
  const creates1000 = createMany(1000);
  const icreates2 = createMany(2);
  const icreates20 = createMany(20);
  const icreates100 = createMany(100);
  const icreates1000 = createMany(1000);

  console.time("Testing 2");
  await db.user.createMany({
    data: creates2,
  });
  console.timeEnd("Testing 2");

  console.time("Testing 20");
  await db.user.createMany({
    data: creates20,
  });
  console.timeEnd("Testing 20");

  console.time("Testing 100");
  await db.user.createMany({
    data: creates100,
  });
  console.timeEnd("Testing 100");

  console.time("Testing 1000");
  await db.user.createMany({
    data: creates1000,
  });
  console.timeEnd("Testing 1000");

  console.time("Itx: Testing 2");
  await db.$transaction(async (p) => {
    await p.user.createMany({
      data: icreates2,
    });
  });
  console.timeEnd("Itx: Testing 2");

  console.time("Itx: Testing 20");
  await db.$transaction(async (p) => {
    await p.user.createMany({
      data: icreates20,
    });
  });
  console.timeEnd("Itx: Testing 20");

  console.time("Itx: Testing 100");
  await db.$transaction(async (p) => {
    await p.user.createMany({
      data: icreates100,
    });
  });
  console.timeEnd("Itx: Testing 100");

  console.time("Itx: Testing 1000");
  await db.$transaction(async (p) => {
    await p.user.createMany({
      data: icreates1000,
    });
  });
  console.timeEnd("Itx: Testing 1000");
};

main().catch(console.log);

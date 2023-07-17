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
import { withAccelerate } from "@prisma/extension-accelerate";

const db = new PrismaClient();
const acc = new PrismaClient().$extends(withAccelerate());

const main = async () => {
  for (let index = 0; index < 20; index++) {
    console.time('regular')
    await db.notes.findFirst();
    console.timeEnd('regular')

    console.time('QE')
    await acc.notes.findFirst();
    console.timeEnd('QE')

    console.time('Cache')
    await acc.notes.findFirst({
      cacheStrategy: {
        ttl: 100,
      },
    });
    console.timeEnd('Cache')

    console.log('----------------------------------')
  }
};

main().catch(console.log);

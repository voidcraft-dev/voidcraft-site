import { configureCmsClient } from "./cms-client";

configureCmsClient({
  baseUrl:
    process.env.NEXT_PUBLIC_CMS_URL ?? "https://admin.voidcraft-dev.com",
});

export * from "./cms-client";

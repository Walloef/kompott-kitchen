import { CodegenConfig } from "@graphql-codegen/cli";
require("dotenv").config({ path: ".env.local" });

const config: CodegenConfig = {
  schema: `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`,
  documents: ["graphql/**/*.graphql"],
  generates: {
    "./generated/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: "useFragment" },
      },
      plugins: [],
    },
  },
};

export default config;

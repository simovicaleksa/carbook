/* eslint-disable import/no-anonymous-default-export */
/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions & import('@trivago/prettier-plugin-sort-imports').PluginConfig} */
export default {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "^next",
    "^react",
    "<THIRD_PARTY_MODULES>",
    "^~/styles",
    "^~/env",
    "^~/app",
    "^~/db",
    "^~/lib",
    "^~/context",
    "^~/hooks",
    "^~/ui",
    "^~/components",
    "^~",
    "^\\.\\./",
    "^\\./",
  ],
  importOrderSeparation: true,
};

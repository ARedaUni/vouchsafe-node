import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: "https://app.vouchsafe.id/openapi/swagger.json",
  output: "src/gen",
  plugins: ["@hey-api/client-fetch"],
})

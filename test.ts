const { VouchsafeClient } = require("./dist/cjs")

const run = async () => {
  const client = new VouchsafeClient({
    clientId: "cm0mex8rb0000zua9mrulldnx",
    clientSecret: "prod-18bb596a-eb16-4913-9119-493cb7245f54",
  })

  try {
    const verifications = await client.listVerifications()
    console.log("Verifications:", verifications)
  } catch (err) {
    console.error("Error:", err)
  }
}

run()

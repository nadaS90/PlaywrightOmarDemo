import fs from "fs";

async function globalTeardown() {
  fs.writeFileSync(
    "teardown.txt",
    `Global teardown executed at ${new Date().toISOString()}`,
  );

  console.log("GLOBAL TEARDOWN EXECUTED");
}

export default globalTeardown;

const fs = require("fs");
const jobs = require("@wzlin/jobs");
const mkdirp = require("mkdirp");
const path = require("path");

const BUILD = path.join(__dirname, "build");
mkdirp.sync(BUILD);

const COMPANIES = [
  "Apple",
  "Amazon",
  "Facebook",
  "Google",
  "Microsoft",
  "Twitter",
];

(async () => {
  const rawJobs = await jobs.fetchAndParse({
    cacheDir: path.join(__dirname, "cache"),
    companies: COMPANIES,
  });

  await fs.promises.writeFile(
    path.join(BUILD, "jobs.json"),
    JSON.stringify(rawJobs, null, 2)
  );
})().catch(console.error);

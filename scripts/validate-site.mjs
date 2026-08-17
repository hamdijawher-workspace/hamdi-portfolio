import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if ([".git", "node_modules"].includes(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
};
walk(root);

const htmlFiles = files.filter((file) => file.endsWith(".html"));
const errors = [];
const localRef = /(?:src|href|poster)=["']([^"']+)["']/g;

for (const file of htmlFiles) {
  const source = readFileSync(file, "utf8");
  const label = relative(root, file);
  if (!/<title>[^<]+<\/title>/.test(source)) errors.push(`${label}: missing title`);
  if (!/name=["']description["']/.test(source) && !label.endsWith("approach.html")) errors.push(`${label}: missing description`);
  if (!/<main\b/.test(source) && !label.endsWith("approach.html")) errors.push(`${label}: missing main landmark`);
  for (const match of source.matchAll(localRef)) {
    const ref = match[1].split("#")[0].split("?")[0];
    if (!ref || /^(?:https?:|mailto:|tel:|data:|#)/.test(ref)) continue;
    const target = resolve(dirname(file), decodeURIComponent(ref));
    if (!existsSync(target)) errors.push(`${label}: missing local reference ${ref}`);
  }
}

const required = [
  "index.html", "work.html", "about.html", "work-with-me.html", "contact.html",
  "work/aurea-beyond-ordinary.html", "work/delishio-taste-the-cold.html",
  "work/sidi-bou-said-the-blue-story.html", "work/forvia.html",
  "work/biokiosk.html", "work/smartwebpay.html", "work/transitun.html",
  "css/director.css", "js/director.js", "assets/og.jpg"
];
for (const item of required) if (!existsSync(join(root, item))) errors.push(`missing required file ${item}`);

if (errors.length) {
  console.error(`Site validation failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Validated ${htmlFiles.length} HTML pages and ${files.length} total files.`);

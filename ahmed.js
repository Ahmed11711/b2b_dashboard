import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* ========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ========================= */
const model = process.argv[2];
const isRemove = process.argv.includes("--remove");

if (!model) {
  console.log("❌ Provide model name");
  process.exit(1);
}

const Model = capitalize(model);

/* ========================= */
const basePath = path.join(process.cwd(), "src");

const pagesDir = path.join(basePath, "pages", model);
const schemaFile = path.join(basePath, "schemas", `${model}Schema.js`);
const appFile = path.join(basePath, "App.tsx");
const layoutFile = path.join(basePath, "components/Layout.tsx");

/* =========================
   REMOVE MODE
========================= */
if (isRemove) {
  console.log(`🗑 Removing ${model}...`);

  // delete page folder
  if (fs.existsSync(pagesDir)) {
    fs.rmSync(pagesDir, { recursive: true, force: true });
    console.log("✅ Pages deleted");
  }

  // delete schema
  if (fs.existsSync(schemaFile)) {
    fs.unlinkSync(schemaFile);
    console.log("✅ Schema deleted");
  }

  /* ---- clean App.tsx ---- */
  let appContent = fs.readFileSync(appFile, "utf-8");

  // remove import
  appContent = appContent.replace(
    new RegExp(`import ${Model}Page.*\\n`, "g"),
    ""
  );

  appContent = appContent.replace(
    new RegExp(`import \\{ ${Model}Fields \\}.*\\n`, "g"),
    ""
  );

  // remove route block
  appContent = appContent.replace(
    new RegExp(
      `\\/\\*\\* AUTO ROUTE: ${model} \\*\\/([\\s\\S]*?)<\\/Route>`,
      "g"
    ),
    ""
  );

  fs.writeFileSync(appFile, appContent);

  /* ---- clean Layout ---- */
  let layoutContent = fs.readFileSync(layoutFile, "utf-8");

  layoutContent = layoutContent.replace(
    new RegExp(
      `\\{ icon: .*?, label: "${capitalize(model)}", path: "\\/${model}" \\},?`,
      "g"
    ),
    ""
  );

  fs.writeFileSync(layoutFile, layoutContent);

  console.log(`🔥 ${model} removed بالكامل`);
  process.exit(0);
}

/* =========================
   CREATE MODE
========================= */

fs.mkdirSync(pagesDir, { recursive: true });

/* ---- schema ---- */
fs.writeFileSync(
  schemaFile,
  `
export const ${Model}Fields = [
  { name: "title", type: "text", label: "Title" }
];
`.trim()
);

/* ---- page ---- */
fs.writeFileSync(
  path.join(pagesDir, `${Model}Page.jsx`),
  `
import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { ${Model}Fields } from "../../schemas/${model}Schema";

export default function ${Model}Page() {
  return (
    <GenericListPage
      endpoint="${model}"
      headers={${Model}Fields}
      title={"All ${model}"}
    />
  );
}
`.trim()
);

/* ---- update App ---- */
let appContent = fs.readFileSync(appFile, "utf-8");

const pageImport = `import ${Model}Page from "./pages/${model}/${Model}Page";`;

if (!appContent.includes(pageImport)) {
  appContent = insertAfterLastImport(appContent, pageImport);
}

const routeBlock = `
{/* AUTO ROUTE: ${model} */}
<Route
  path="/${model}"
  element={
    <ProtectedRoute>
      <${Model}Page />
    </ProtectedRoute>
  }
/>
`;

appContent = appContent.replace(
  "{/* AUTO ROUTES START */}",
  routeBlock + "\n{/* AUTO ROUTES START */}"
);

fs.writeFileSync(appFile, appContent);

/* ---- update Layout ---- */
let layoutContent = fs.readFileSync(layoutFile, "utf-8");

const navItem = `{ icon: User, label: "${capitalize(model)}", path: "/${model}" },`;

if (!layoutContent.includes(`"/${model}"`)) {
  layoutContent = layoutContent.replace(
    "const adminNavItems = [",
    `const adminNavItems = [\n  ${navItem}`
  );
}

fs.writeFileSync(layoutFile, layoutContent);

/* ========================= */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function insertAfterLastImport(content, newImport) {
  const lines = content.split("\n");
  let last = 0;

  lines.forEach((l, i) => {
    if (l.startsWith("import")) last = i;
  });

  lines.splice(last + 1, 0, newImport);
  return lines.join("\n");
}

/* ========================= */
console.log(`✅ ${model} created successfully!`);
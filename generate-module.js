import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleName = process.argv[2]; 
if (!moduleName) {
  console.error("❌ Please provide a module name (e.g., node generate-module.js Product)");
  process.exit(1);
}

const lowerName = moduleName.toLowerCase();
const pluralName = lowerName + 's';

const paths = {
  fields: path.join(__dirname, `src/constants/fields/${moduleName}Fields.js`),
  app: path.join(__dirname, 'src/App.js')
};

const fieldsTemplate = `
export const ${moduleName}Fields = [
  { key: "id", label: "ID", type: "text", form_show: false, table_show: true },
  { key: "title", label: "Title", type: "text", required: 1, form_show: true, table_show: true },
  { key: "created_at", label: "Created At", type: "date", form_show: false, table_show: true },
];
`;

if (!fs.existsSync(path.dirname(paths.fields))) fs.mkdirSync(path.dirname(paths.fields), { recursive: true });

fs.writeFileSync(paths.fields, fieldsTemplate.trim());
console.log(`✅ Fields created: ${paths.fields}`);

let appContent = fs.readFileSync(paths.app, 'utf8');

const importStatement = `import { ${moduleName}Fields } from "./constants/fields/${moduleName}Fields";\n`;
if (!appContent.includes(importStatement)) {
    appContent = importStatement + appContent;
}

const newRoute = `
          <Route 
            path="/${pluralName}/edit/:id" 
            element={<GenericFormPage endpoint="${pluralName}" fields={${moduleName}Fields} mode="edit" title="Edit ${moduleName}" />} 
          />`;

if (!appContent.includes(`path="/${pluralName}/edit/:id"`)) {
    appContent = appContent.replace('</Routes>', `\${newRoute}\n          </Routes>`);
    fs.writeFileSync(paths.app, appContent);
    console.log(`🚀 Route injected into App.js for ${moduleName}`);
} else {
    console.log(`⚠️ Route for ${moduleName} already exists.`);
}
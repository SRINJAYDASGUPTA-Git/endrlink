import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends:['next'],
    rules: {
      "react/react-in-jsx-scope": "off", // Next.js does not require React to be in scope
      "no-unused-vars": "off", // Allow unused variables prefixed with _
      "import/no-unresolved": "off", // Disable unresolved import checks
      "typescript-eslint/no-explicit-any": "off", // Allow explicit 'any' type in TypeScript

    },
  }),
];

export default eslintConfig;

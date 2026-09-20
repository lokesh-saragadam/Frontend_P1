import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["dist/**", "node_modules/**"] },
  // 1. Any base JS setup
  { 
    files: ["**/*.{js,mjs,cjs,jsx}"], 
    languageOptions: { globals: globals.browser } 
  },
  
  // 2. React's recommended rules (which turns the error ON)
  pluginReact.configs.flat.recommended,
  
  // 3. YOUR custom rules (these come last to turn the error OFF)
  {
    settings: { react: { version: "detect" } },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrors: "none" }],
      "react/react-in-jsx-scope": "off",  //turns off the demand for importing react in every .jsx file.
      "react/jsx-uses-react": "off",
      "react/prop-types": "off" // <- turns off the prop type error that demand the definition of json objects.
    }
  }
]);


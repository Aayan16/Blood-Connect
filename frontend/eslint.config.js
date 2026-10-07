import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "public/**"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // 1. Requester cannot import donor or hospital
  {
    files: ["src/features/requester/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/donor*",
                "@/features/hospital*",
                "../donor*",
                "../hospital*",
                "../../donor*",
                "../../hospital*",
              ],
              message:
                "Features cannot import from other actor feature modules. Move shared code to src/shared.",
            },
          ],
        },
      ],
    },
  },

  // 2. Donor cannot import requester or hospital
  {
    files: ["src/features/donor/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/requester*",
                "@/features/hospital*",
                "../requester*",
                "../hospital*",
                "../../requester*",
                "../../hospital*",
              ],
              message:
                "Features cannot import from other actor feature modules. Move shared code to src/shared.",
            },
          ],
        },
      ],
    },
  },

  // 3. Hospital cannot import requester or donor
  {
    files: ["src/features/hospital/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/requester*",
                "@/features/donor*",
                "../requester*",
                "../donor*",
                "../../requester*",
                "../../donor*",
              ],
              message:
                "Features cannot import from other actor feature modules. Move shared code to src/shared.",
            },
          ],
        },
      ],
    },
  },

  // 4. Shared cannot import from any features/* folder
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*",
                "../features/*",
                "../../features/*",
                "../../../features/*",
              ],
              message:
                "Shared modules must never import from actor feature folders.",
            },
          ],
        },
      ],
    },
  },
];

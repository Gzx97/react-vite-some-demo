import js from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config({
  extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintPluginPrettierRecommended],
  files: ["**/*.{ts,tsx}"],
  ignores: ["dist", "node_modules", ".vscode", ".husky"],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
    "simple-import-sort": simpleImportSort,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    // 禁用「不可达代码」检测（核心：防止删除return后的代码）
    "no-unreachable": "off",
    // TS项目需额外禁用@typescript-eslint的对应规则
    "@typescript-eslint/no-unreachable": "off",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unsafe-function-type": "off",
    // 未使用变量相关规则（从 error 改为 warn）
    "no-unused-vars": "warn", // 禁用原生规则，使用 TS 专属规则
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        // 可选配置（根据需求调整）
        argsIgnorePattern: "^_", // 忽略以下划线开头的参数（如 (_props) => {}）
        varsIgnorePattern: "^_", // 忽略以下划线开头的变量
        caughtErrorsIgnorePattern: "^_", // 忽略 catch 中以下划线开头的错误变量
      },
    ],
    "no-multiple-empty-lines": ["error", { max: 1 }], // 禁止多个空行
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          [
            "^(node:|vite)",
            "^react",
            "^@?\\w",
            "^@/(components|assets)",
            "^\\.\\.(?!/?$)",
            "^\\.\\./?$",
            "^\\./(?=.*/)(?!/?$)",
            "^\\.(?!/?$)",
            "^\\./?$",
            "^@/(utils|store|hooks|api|router|constants|theme)",
          ],
          ["antd/locale/zh_CN", "dayjs/locale/zh-cn"],
          ["^.+\\.s?css$"],
        ],
      },
    ],
  },
});

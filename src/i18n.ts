import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// 1. 引入语言检测插件
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // 2. 注册语言检测插件
  .init({
    resources,
    lng:
      typeof window !== "undefined"
        ? localStorage.getItem("i18next_language") || "zh" // 先读缓存，无则用zh
        : "zh", // 服务端默认zh（SSR场景）
    fallbackLng: "zh",
    supportedLngs: ["zh", "en"],
    nonExplicitSupportedLngs: true,
    load: "currentOnly",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false, // React 已自带转义，无需重复
    },
    detection: {
      order: ["localStorage", "cookie", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"], // 缓存到 localStorage 和 cookie
      cookieOptions: {
        path: "/",
        maxAge: 365 * 24 * 60 * 60, // 1年有效期
        sameSite: "lax", // 增加 cookie 安全性（可选）
      },
      // 自定义 localStorage/cookie 键名（可选，便于识别）
      lookupLocalStorage: "i18next_language",
      lookupCookie: "i18next_language",
    },
    react: {
      useSuspense: false,
      bindI18n: "languageChanged",
      bindI18nStore: "",
    },
  });

export default i18n;

module.exports = {
  preset: "jest-expo",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  // legacy-web 는 별도 앱 — jest 스캔에서 제외 (haste 이름 충돌 방지).
  modulePathIgnorePatterns: ["<rootDir>/legacy-web/"],
  testPathIgnorePatterns: ["/node_modules/", "/legacy-web/"],
};

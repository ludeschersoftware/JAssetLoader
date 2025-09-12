import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    transform: {
        "^.+\\.[tj]sx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.json",
                useESM: true, // <— important
            },
        ],
    },
    extensionsToTreatAsEsm: [".ts"], // treat TS as ESM too
    moduleFileExtensions: ["ts", "tsx", "js"],
    testMatch: ["**/*.test.ts"],
    roots: ["./src", "./tests"],
    clearMocks: true,
    transformIgnorePatterns: [
        // Don’t ignore our ESM deps:
        "/node_modules/(?!(?:@ludeschersoftware/promise|@ludeschersoftware/ref|@ludeschersoftware/utils|@ludeschersoftware/math|@ludeschersoftware/result)/)",
    ],
    // jest.config.ts
    moduleNameMapper: {
        "^@ludeschersoftware/promise$": "<rootDir>/node_modules/@ludeschersoftware/promise/index.js",
        "^@ludeschersoftware/ref$": "<rootDir>/node_modules/@ludeschersoftware/ref/index.js",
        "^@ludeschersoftware/utils$": "<rootDir>/node_modules/@ludeschersoftware/utils/index.js",
        "^@ludeschersoftware/math$": "<rootDir>/node_modules/@ludeschersoftware/math/index.js",
        "^@ludeschersoftware/result$": "<rootDir>/node_modules/@ludeschersoftware/result/index.js",
    },
    setupFiles: ["<rootDir>/tests/setupJest.ts"],

};

export default config;
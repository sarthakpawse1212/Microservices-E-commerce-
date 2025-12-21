import type {Config} from 'jest';

const config: Config = {
  preset: "ts-jest",
  clearMocks: true,
  verbose: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleDirectories: ["node_modules", "src"]
};

export default config;

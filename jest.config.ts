import type { Config } from '@jest/types';
import { defaults } from 'jest-config';

const config: Config.InitialOptions = {
  ...defaults,
  testTimeout: 450000,
  verbose: true,
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js'],
  modulePathIgnorePatterns: ['<rootDir>/build'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts', 'jest-extended/all'],
};

export default config;

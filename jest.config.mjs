// jest.config.mjs
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+.tsx?$': ['ts-jest', { useESM: true, tsconfig: './tsconfig.spec.json' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!(@wagmi|@viem|@tanstack)/)'],
};

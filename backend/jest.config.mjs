import presets from 'ts-jest/presets/index.js'

export default {
  ...presets.defaultsESM, // Accedemos a defaultsESM desde el objeto importado
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts'],
  coverageDirectory: './coverage',
}

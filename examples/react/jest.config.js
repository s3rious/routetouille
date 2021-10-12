module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^components(.*)$': '<rootDir>/src/components$1',
    '^domains(.*)$': '<rootDir>/src/domains$1',
    '^services(.*)$': '<rootDir>/src/services$1',
  },
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },
}

module.exports = {
  testEnvironment: 'node',
  globals: {
    jest: true,
    describe: true,
    it: true,
    expect: true,
    beforeEach: true,
    afterEach: true
  },
  moduleNameMapper: {
    '^@models$': '<rootDir>/app/models',
    '^@controllers/(.*)$': '<rootDir>/app/controllers/$1',
    '^@services/(.*)$': '<rootDir>/app/services/$1'
  },
  moduleDirectories: ['node_modules', 'app']
};

export default {
    testEnvironment: 'node',
    transform: {},
    moduleFileExtensions: ['js', 'mjs'],
    testMatch: ['**/*.test.mjs'],
    setupFilesAfterEnv: ['./jest.setup.mjs'],
    verbose: true,
    moduleNameMapper: {
        '\\.test\\.mjs$': '<rootDir>/__mocks__/fileMock.js',
    },
};
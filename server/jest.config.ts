export default {
    transform: {
        '^.+\\.tsx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '^tests/(.*)$': '<rootDir>/src/tests/$1',
    },
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};

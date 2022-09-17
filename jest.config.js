module.exports = {
    setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
    testIgnorePatterns: ['/node_modules/', '/.next/'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    },
    testEnvironment: 'jsdom',
};

export default {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
	moduleNameMapper: {
		"src/(.*)": "<rootDir>/src/$1",
	},
	preset: "ts-jest",
	testEnvironment: "jest-environment-node",
};

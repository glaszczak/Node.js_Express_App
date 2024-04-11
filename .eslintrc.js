module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        'no-console': ['error'],
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'prettier/prettier': ['error', { printWidth: 150 }],
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
    },
};

module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['airbnb-base', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['prettier', 'import'],
    rules: {
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
                VariableDeclarator: 'first',
                MemberExpression: 1,
                ObjectExpression: 1,
                FunctionExpression: {
                    parameters: 'first',
                },
                FunctionDeclaration: {
                    parameters: 'first',
                },
                CallExpression: {
                    arguments: 'first',
                },
                flatTernaryExpressions: true,
                offsetTernaryExpressions: true,
            },
        ],
        'prettier/prettier': [
            'error',
            {
                usePrettierrc: true,
            },
        ],
        camelcase: 'off',
        'import/prefer-default-export': 'off',
        'no-param-reassign': 'off',
        'class-methods-use-this': 'off',
        'no-undef': 'off',
        'comma-dangle': [
            'error',
            {
                arrays: 'only-multiline',
                objects: 'only-multiline',
                imports: 'never',
                exports: 'never',
                functions: 'never',
            },
        ],
        'linebreak-style': 0,
        'no-unused-vars': 'off',
        'operator-linebreak': 'off',
        'array-callback-return': 'off',
        'consistent-return': 'off',
        'no-else-return': [
            'error',
            {
                allowElseIf: true,
            },
        ],
        'no-array-constructor': 'off',
        'default-case': 'off',
        'no-fallthrough': 'off',
        'no-case-declarations': 'off',
        'no-nested-ternary': 'off',
        'no-new': 'off',
        'multiline-ternary': ['error', 'always-multiline'],
        'no-console': [
            'error',
            {
                allow: ['error'],
            },
        ],
        'no-useless-constructor': 'off',
    },
};

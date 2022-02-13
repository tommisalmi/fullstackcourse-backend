module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    rules: {
        indent: [
            'error',
            4],
        eqeqeq: 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [
            'error', 'always'],
        'arrow-spacing': [
            'error', { before: true, after: true },
        ],
        'linebreak-style': [
            'error',
            'unix'],
        quotes: [
            'error',
            'single',
        ],
        semi: [
            'error',
            'never',
        ],
    },
}

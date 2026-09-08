import tseslint from 'typescript-eslint'
import hooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-config-prettier'
export default tseslint.config(
  {
    ignores: ['dist/**', 'storybook-static/**', 'node_modules/**', 'artifacts/**', 'coverage/**', 'src/tokens.ts'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.tsx'],
    languageOptions: jsxA11y.flatConfigs.recommended.languageOptions,
    plugins: { 'react-hooks': hooks, 'jsx-a11y': jsxA11y },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
  {
    // Plain-JS example fixtures (examples/next), kept dependency-free of the TS project service so
    // they lint without needing that fixture's own separate install.
    files: ['**/*.jsx'],
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': hooks, 'jsx-a11y': jsxA11y },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
  prettier,
)

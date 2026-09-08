import tseslint from 'typescript-eslint'
import hooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-config-prettier'
export default tseslint.config(
  { ignores: ['dist/**', 'storybook-static/**', 'node_modules/**', 'artifacts/**', 'src/tokens.ts', 'examples/**'] },
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
  prettier,
)

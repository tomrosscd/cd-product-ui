import tseslint from 'typescript-eslint'
import hooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'
export default tseslint.config(
  { ignores: ['dist/**', 'storybook-static/**', 'node_modules/**', 'artifacts/**', 'src/tokens.ts', 'examples/**'] },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.tsx'],
    plugins: { 'react-hooks': hooks },
    rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'error' },
  },
  prettier,
)

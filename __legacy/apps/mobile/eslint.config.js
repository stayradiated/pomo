import js from '@eslint/js'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import ts from 'typescript-eslint'

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.svelte'],

    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    ignores: ['build/', '.svelte-kit/', 'dist/'],
  },
  {
    rules: {
      'no-undef': 'off',

      // These are causing issues with NoteDrawer.svelte
      // It seems that `svelte-check` expects a comma-delimited list
      // but the eslint plugin expects a space-delimited list
      //
      // We don't seem to lose much by disabling these rules, as the
      // `svelte-check` should catch these issues anyway
      'svelte/no-unused-svelte-ignore': 'off',
      'svelte/valid-compile': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
)

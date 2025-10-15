// eslint.config.js
import js from '@eslint/js';
import pluginTailwind from 'eslint-plugin-tailwindcss';

export default [
  js.configs.recommended,
  pluginTailwind.configs['flat/recommended'],
  {
    rules: {
      // eigene Regeln (optional)
      'no-unused-vars': 'warn',
    },
  },
];

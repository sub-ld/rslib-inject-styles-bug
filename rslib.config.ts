import { defineConfig } from '@rslib/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  lib: [
    {
      bundle: true,
      dts: true,
      format: 'esm',
    },
  ],
  output: {
    injectStyles: true,  // This causes the issue
    target: 'web',
  },
  plugins: [pluginReact()],
});

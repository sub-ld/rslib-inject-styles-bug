# rslib injectStyles ESM Bug Reproduction

This repository demonstrates a bug in `@rslib/core` version 0.14.0 where using `injectStyles: true` with `format: 'esm'` generates code that references `module.id`, causing runtime errors in browsers.

## Issue Description

When building an ESM library with `injectStyles: true`, rslib generates code that includes CommonJS-style `module.id` references. Since ESM environments don't have a global `module` object, this causes:

```
Uncaught ReferenceError: module is not defined
```

## Reproduction Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the library:**
   ```bash
   npm run build
   ```

3. **Check for problematic code:**
   ```bash
   grep -n "module\.id" dist/index.js
   ```
   This will show `module.id` references in the built ESM code.

4. **Test in browser:**
   Open `test.html` in a browser and check the console. You'll see:
   ```
   Uncaught ReferenceError: module is not defined
   ```

## Expected Behavior

ESM libraries with `injectStyles: true` should not contain CommonJS artifacts like `module.id`. The CSS injection should work without requiring a global `module` object.

## Configuration

The issue occurs with this rslib configuration:

```typescript
export default defineConfig({
  lib: [
    {
      bundle: true,
      dts: true,
      format: 'esm',  // ESM format
    },
  ],
  output: {
    injectStyles: true,  // This causes the issue
    target: 'web',
  },
  plugins: [pluginReact()],
});
```

## Environment

- **@rslib/core**: 0.14.0
- **@rsbuild/core**: 1.5.12
- **@rsbuild/plugin-react**: 1.4.1
- **Node.js**: Latest
- **Browser**: Any modern browser

## Workaround

The issue can be temporarily resolved by adding a module polyfill to the generated code, but this shouldn't be necessary for proper ESM output.

## Related

This issue appeared after upgrading from rslib 0.13.0 to 0.14.0, suggesting it's a regression in how CSS injection is handled for ESM libraries.

# Issue Details for rslib GitHub Issue

## Summary

`@rslib/core` version 0.14.0 generates `module.id` references when using `injectStyles: true` with `format: 'esm'`, causing runtime errors in browsers.

## Environment

- **@rslib/core**: 0.14.0
- **@rsbuild/core**: 1.5.12
- **@rsbuild/plugin-react**: 1.4.1
- **Node.js**: Latest
- **Browser**: Any modern browser

## Problematic Code Generated

The built ESM library contains:

```javascript
___CSS_LOADER_EXPORT___.push([
  module.id, // ← This causes the error
  `.my-component { ... }`,
]);
```

## Error Message

```
Uncaught ReferenceError: module is not defined
    at <built-library-code>
```

## Configuration That Causes Issue

```typescript
export default defineConfig({
  lib: [
    {
      bundle: true,
      dts: true,
      format: "esm", // ESM format
    },
  ],
  output: {
    injectStyles: true, // Combined with ESM, this causes the issue
    target: "web",
  },
  plugins: [pluginReact()],
});
```

## Expected Behavior

ESM libraries should not contain CommonJS artifacts like `module.id`. CSS injection should work without requiring a global `module` object.

## Reproduction Status

✅ **Confirmed reproducible** with this minimal case:

- Built bundle contains `module.id` at line 1638: `grep "module.id" dist/index.js`
- Browser error: `ReferenceError: module is not defined at http://localhost:5173/@fs/.../dist/index.js:1656:3`
- Consumer React app fails to render due to the error

## Impact

This prevents libraries from using both `injectStyles: true` and `format: 'esm'` simultaneously, forcing developers to choose between ESM compatibility and convenient style injection.

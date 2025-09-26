# rslib `module.id` Bug Reproduction

This repository demonstrates a critical bug in `@rslib/core` v0.14.0 where `injectStyles: true` with ESM format generates CommonJS artifacts in ESM bundles, causing runtime errors.

## 🎯 Root Cause Discovered

The issue occurs when **ALL** these conditions are met:

1. ✅ `injectStyles: true` in rslib config
2. ✅ `format: "esm"` (ESM output)
3. ✅ `@font-face` declarations in CSS
4. ✅ Any export from the module importing CSS

**Key Finding**: Not React-specific - any export triggers the issue.

## 📋 Minimal Reproduction

**Files needed:**

```
src/
├── index.ts     # import "./globals.css"; export const foo = "bar";
├── globals.css  # @font-face { font-family: "Test"; src: url("..."); }
```

**Result:** `module.id` references in ESM bundle → `ReferenceError: module is not defined`

## 🚀 Quick Reproduction

1. **Install and build**:

   ```bash
   npm install
   npm run build
   ```

2. **Verify the bug**:

   ```bash
   grep "module.id" dist/index.js
   # Output: module.id references found
   ```

3. **Test runtime error**:
   ```bash
   npm run build:consumer
   npm run preview
   # Open http://localhost:4173 → Console shows ReferenceError
   ```

## 🧪 Test Matrix

| CSS Import | Export | `module.id` | Result               |
| ---------- | ------ | ----------- | -------------------- |
| None       | Yes    | 0           | ✅ Works             |
| @font-face | None   | 1           | ⚠️ Builds but unused |
| @font-face | Yes    | 1           | ❌ **Runtime Error** |

## 🐛 The Problem

**Generated ESM code contains:**

```javascript
___CSS_LOADER_EXPORT___.push([
  module.id, // ← CommonJS artifact in ESM!
  `@font-face { ... }`,
]);
```

**Runtime error:**

```
Uncaught ReferenceError: module is not defined
```

## 🔧 Configuration

**Problematic config:**

```typescript
export default defineConfig({
  lib: [{ format: "esm" }],
  output: { injectStyles: true }, // ← Causes issue with @font-face
});
```

## ✅ Workarounds

### Option 1: Disable Style Injection (Recommended)

```typescript
export default defineConfig({
  output: { injectStyles: false }, // Generate separate CSS
});
```

### Option 2: CSS-in-JS

```typescript
import { createGlobalStyle } from "styled-components";
const GlobalStyles = createGlobalStyle`@font-face { ... }`;
```

### Option 3: Consumer-Side Import

```typescript
// Library: No CSS import
export const foo = "bar";

// Consumer: Import CSS separately
import "library/dist/index.css";
import { foo } from "library";
```

## 🔍 Technical Analysis

**Why this is an rslib issue (not Vite):**

- rslib generates the `module.id` references during build
- ESM/CommonJS mismatch in rslib's CSS injection mechanism
- Vite correctly rejects CommonJS artifacts in ESM context

**Evidence:**

- `injectStyles: true` → 14.9 kB bundle with `module.id`
- `injectStyles: false` → 0.03 kB bundle + separate CSS

## 🚨 Impact

- **Blocks ESM adoption** for libraries using fonts
- **Forces workarounds** or separate CSS handling
- **Critical for modern library development**

## 📁 Repository Structure

- `src/` - Minimal reproduction library
- `consumer-app/` - Test consumer application
- `ISSUE_DETAILS.md` - Comprehensive technical analysis
- `rslib.config.ts` - Configuration demonstrating issue

## 🎯 Expected Fix

rslib should properly transform CSS loader output for ESM compatibility, eliminating CommonJS artifacts like `module.id` in ESM bundles.

## Environment

- **@rslib/core**: 0.14.0
- **@rsbuild/core**: 1.5.12
- **@rsbuild/plugin-react**: 1.4.1
- **Node.js**: Latest
- **Browser**: Any modern browser

---

**Status**: ✅ **Confirmed Critical Bug** - Ready for rslib team investigation

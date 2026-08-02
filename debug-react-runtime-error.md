# Debug Session: react-runtime-error
- **Status**: [OPEN]
- **Issue**: Browser runtime still throws `Uncaught ReferenceError: React is not defined` from `App.jsx:16` after adding Vite React plugin support.
- **Debug Server**: http://127.0.0.1:7777/event
- **Log File**: .dbg/trae-debug-log-react-runtime-error.ndjson

## Reproduction Steps
1. Start the Vite dev server.
2. Open `http://localhost:5173/`.
3. Observe the runtime error in the browser console.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | The browser is serving a stale transformed `App.jsx` module that still expects `React` in scope. | High | Low | Rejected. Live logs show fresh HMR timestamps and fresh module URLs. |
| B | The running dev server is not loading `vite.config.js`, so JSX is still compiled without the React plugin. | High | Low | Confirmed. Served `/src/App.jsx` compiled to `React.createElement(...)` without auto-importing React. |
| C | A child component rendered by `App` still contains JSX transformed to `React.createElement(...)`, and the stack points at `App`. | Medium | Low | Partially confirmed. `Header.jsx` and `Footer.jsx` also lacked `React` imports and needed the same fix. |
| D | The app is resolving files from a different root or duplicate source tree than the one we edited. | Medium | Medium | Rejected. Runtime logs came from the same `src/main.jsx` and `src/App.jsx` paths we edited. |
| E | A direct `React` identifier is still referenced in transformed output at runtime despite the plugin being active. | Low | Medium | Confirmed pre-fix, addressed post-fix by explicitly importing React in JSX files. |

## Log Evidence
- Pre-fix log showed `main module loaded`, `App module loaded`, and repeated `App function entered` entries, but no `HomePage effect ran`, which localized the crash to `App` render before mount.
- Served `http://localhost:5173/src/App.jsx` pre-fix returned `React.createElement(...)` with no `react` import.
- Served `http://localhost:5173/src/App.jsx` post-fix now includes `import ... from "/node_modules/.vite/deps/react.js"` before the `React.createElement(...)` calls.
- Additional source sweep found three JSX files missing React imports: `src/App.jsx`, `src/components/Header.jsx`, and `src/components/Footer.jsx`.

## Verification Conclusion
- Root cause: this app is being served with the classic JSX transform, not the automatic runtime, so JSX files must have `React` in scope.
- Minimal fix applied: added `import React from 'react';` to `src/App.jsx`, `src/components/Header.jsx`, and `src/components/Footer.jsx`.
- Instrumentation remains in place for one verification pass before cleanup.

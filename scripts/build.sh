#!/usr/bin/env zsh

YOGA_WASM_WEB=./node_modules/yoga-wasm-web
YOGA_WASM_WEB_PKG=$YOGA_WASM_WEB/package.json

# Patch yoga-wasm-web/package.json to stop bun from importing the browser version
jq 'del(.exports["./auto"].browser)' "$YOGA_WASM_WEB_PKG" > "${YOGA_WASM_WEB_PKG}.tmp"
mv "${YOGA_WASM_WEB_PKG}.tmp" "$YOGA_WASM_WEB_PKG"

# Patch vfile to export process correctly
sd -s \
  "export {default as proc} from 'process'" \
  "export * as proc from 'process'" \
  ./node_modules/vfile/lib/minproc.js

bun build --target bun ./src/index.ts --outdir ./dist

cp $YOGA_WASM_WEB/dist/yoga.wasm ./dist/yoga.wasm

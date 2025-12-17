---
"@inkcre/web-design": minor
---

Optimize Histoire build by externalizing CodeMirror, vscode-json-languageservice, Vue, vue-router, @vueuse/core, and dayjs to CDN. This reduces the vendor bundle size from 35MB to 30MB (16% reduction, ~5.7MB savings). The remaining bundle size is primarily Histoire's core UI framework which cannot be externalized.

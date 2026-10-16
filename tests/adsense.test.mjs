import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const exports = {};
vm.runInNewContext(ts.transpileModule(
  fs.readFileSync(new URL("../lib/adsense.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText, { exports });

test("publisher matches the owner supplied snippet and ads.txt", () => {
  assert.equal(exports.ADSENSE_CLIENT, "ca-pub-9440869401891473");
  assert.equal(fs.readFileSync(new URL("../public/ads.txt", import.meta.url), "utf8").trim(),
    "google.com, pub-9440869401891473, DIRECT, f08c47fec0942fa0");
});

test("all public pages are allowed, private and unknown routes fail closed", () => {
  for (const path of ["/", "/crea-mazzo", "/migliora", "/ban", "/privacy", "/termini", "/ban/"]) {
    assert.equal(exports.isAdSensePage(path), true, path);
  }
  for (const path of [null, "/amministrazione", "/i-miei-mazzi", "/i-miei-mazzi/example", "/auth/done", "/auth/callback", "/api/admin/users", "/unknown"]) {
    assert.equal(exports.isAdSensePage(path), false, String(path));
  }
});

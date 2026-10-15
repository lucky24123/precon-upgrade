import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

// Run the actual route implementations with a controlled Supabase adapter.
function load(file, imports) {
  const output = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(output, {
    exports, require: name => {
      assert.ok(name in imports, `Unexpected import: ${name}`);
      return imports[name];
    }, URL, Response,
  });
  return exports;
}

function setup({ configured = true, user = true, admin = true, roleError = null, rpcError = null } = {}) {
  const calls = [];
  const client = {
    auth: { getUser: async () => ({ data: { user: user ? { id: "verified-user" } : null }, error: null }) },
    rpc: async (name, args) => {
      calls.push({ name, args });
      return name === "is_site_admin" ? { data: admin, error: roleError }
        : { data: { users: [], total: 0, matched: 0, recent: 0, page: args.p_page, pageSize: 25 }, error: rpcError };
    },
  };
  const helpers = load("../lib/admin.ts", { "./supabase-server": { createSupabaseServerClient: async () => configured ? client : null } });
  const imports = {
    "../../../../lib/admin": helpers,
    "next/server": { NextResponse: { json: (body, init) => new Response(JSON.stringify(body), init) } },
  };
  return {
    users: load("../app/api/admin/users/route.ts", imports).GET,
    me: load("../app/api/admin/me/route.ts", imports).GET,
    calls,
  };
}

test("unconfigured, anonymous and non-admin callers fail closed", async () => {
  for (const [options, expected] of [[{ configured: false }, 503], [{ user: false }, 401], [{ admin: false }, 403], [{ roleError: { code: "unavailable" } }, 503]]) {
    const api = setup(options);
    const response = await api.users(new Request("https://site.test/api/admin/users"));
    assert.equal(response.status, expected);
    assert.equal(api.calls.some(call => call.name === "list_site_users"), false);
    assert.equal((await api.me()).status, expected);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.match(response.headers.get("x-robots-tag"), /noindex/);
  }
});

test("authorized caller receives a bounded page and no-cache response", async () => {
  const api = setup();
  const response = await api.users(new Request("https://site.test/api/admin/users?q=%20test%40example.test%20&page=2"));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("vary"), "Cookie");
  assert.deepEqual(JSON.parse(JSON.stringify(api.calls[1])), { name: "list_site_users", args: { p_search: "test@example.test", p_page: 2 } });
  assert.equal((await response.json()).pageSize, 25);
  assert.deepEqual(await (await api.me()).json(), { admin: true });
});

test("invalid filters are rejected before the directory RPC", async () => {
  for (const params of ["page=0", "page=-1", "page=1.2", "page=1e2", "page=100001", "page=abc", `q=${"a".repeat(201)}`]) {
    const api = setup();
    assert.equal((await api.users(new Request(`https://site.test/api/admin/users?${params}`))).status, 400);
    assert.equal(api.calls.some(call => call.name === "list_site_users"), false);
  }
});

test("database revocation is respected even after role preflight", async () => {
  const api = setup({ rpcError: { code: "42501", message: "sensitive internal detail" } });
  const response = await api.users(new Request("https://site.test/api/admin/users"));
  assert.equal(response.status, 403);
  assert.doesNotMatch(await response.text(), /sensitive/);
});

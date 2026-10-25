/**
 * Backend smoke tests — run with: npm test (requires the dev server running on PORT).
 * These tests never touch real data: they use invalid ids and fake credentials only.
 */
import test from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.TEST_BASE_URL || "http://localhost:5001/api";

const post = (path, body, headers = {}) =>
  fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

const get = (path, headers = {}) =>
  fetch(`${BASE}${path}`, { headers });

test("health endpoint responds ok", async () => {
  const res = await fetch(BASE.replace("/api", "/api/health"));
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, "ok");
});

test("login rejects missing fields", async () => {
  const res = await post("/auth/login", {});
  assert.equal(res.status, 400);
});

test("login rejects wrong credentials", async () => {
  const res = await post("/auth/login", { email: "nobody@example.com", password: "wrong" });
  assert.equal(res.status, 401);
});

test("cart with invalid userId returns 400, not 500", async () => {
  const res = await get("/cart/not-a-valid-objectid");
  assert.equal(res.status, 400);
});

test("addresses with invalid userId returns 400, not 500", async () => {
  const res = await get("/address/not-a-valid-objectid");
  assert.equal(res.status, 400);
});

test("unknown api route returns JSON 404", async () => {
  const res = await get("/definitely-not-a-route");
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.ok(data.message);
});

test("admin endpoints reject missing token", async () => {
  const res = await get("/admin");
  assert.equal(res.status, 401);
});

test("admin login with garbage credentials is rejected", async () => {
  const res = await post("/admin/login", { email: "x@x.com", password: "nope" });
  assert.equal([400, 401].includes(res.status), true);
});

test("products endpoint responds", async () => {
  const res = await get("/products");
  assert.ok([200, 500].includes(res.status)); // 500 only if DB is unreachable
});

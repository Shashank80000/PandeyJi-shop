import api from "./api.js";

// In-memory only: private data is never persisted and each private entry is
// scoped by both the active user and token.
const entries = new Map();
const inFlight = new Map();
const CATALOGUE_TTL = 30_000;
const SEARCH_TTL = 20_000;
const CART_TTL = 15_000;
const ADDRESS_TTL = 2 * 60_000;
const STATIC_TTL = 5 * 60_000;

const currentToken = () => localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
const publicScope = () => "public";
const privateScope = (userId) => `private:${userId}:${currentToken()}`;

export const isAbortError = (error) => error?.name === "AbortError" || error?.name === "CanceledError" || error?.code === "ERR_CANCELED";

function withConsumerSignal(promise, signal) {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(new DOMException("The request was aborted.", "AbortError"));

  return new Promise((resolve, reject) => {
    const abort = () => reject(new DOMException("The request was aborted.", "AbortError"));
    signal.addEventListener("abort", abort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", abort));
  });
}

function requestCached(key, request, { ttl, force = false, signal } = {}) {
  const cached = entries.get(key);
  if (!force && cached?.expiresAt > Date.now()) return withConsumerSignal(Promise.resolve(cached.data), signal);

  let requestPromise = inFlight.get(key);
  if (!requestPromise) {
    requestPromise = request()
      .then((data) => {
        entries.set(key, { data, expiresAt: Date.now() + ttl });
        return data;
      })
      .finally(() => inFlight.delete(key));
    inFlight.set(key, requestPromise);
  }

  return withConsumerSignal(requestPromise, signal);
}

function queryString(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).sort(([first], [second]) => first.localeCompare(second)).forEach(([name, value]) => {
    const normalizedValue = typeof value === "string" ? value.trim() : value;
    if (normalizedValue !== undefined && normalizedValue !== null && normalizedValue !== "") query.set(name, normalizedValue);
  });
  return query.toString();
}

export function getCatalogue(params = {}, options = {}) {
  const query = queryString(params);
  const url = `/products${query ? `?${query}` : ""}`;
  const ttl = options.ttl ?? (params.search ? SEARCH_TTL : CATALOGUE_TTL);
  return requestCached(`${publicScope()}:catalogue:${query}`, () => api.get(url).then(({ data }) => data), { ...options, ttl });
}

export async function getProduct(id, options = {}) {
  // The current API has no product-by-id route. The catalogue read is cached
  // and coalesced, so product detail and related products share one request.
  const data = await getCatalogue({}, options);
  const products = Array.isArray(data) ? data : data?.products || [];
  return products.find((product) => String(product._id) === String(id)) || null;
}

export function getCart(userId, options = {}) {
  if (!userId) return Promise.resolve({ cart: { items: [] } });
  return requestCached(`${privateScope(userId)}:cart`, () => api.get(`/cart/${userId}`).then(({ data }) => data), { ...options, ttl: options.ttl ?? CART_TTL });
}

export function getAddresses(userId, options = {}) {
  if (!userId) return Promise.resolve([]);
  return requestCached(`${privateScope(userId)}:addresses`, () => api.get(`/address/${userId}`).then(({ data }) => data), { ...options, ttl: options.ttl ?? ADDRESS_TTL });
}

export function invalidateCatalogue() {
  for (const key of entries.keys()) if (key.includes(":catalogue:")) entries.delete(key);
}

export function invalidateCart(userId) {
  if (userId) entries.delete(`${privateScope(userId)}:cart`);
}

export function invalidateAddresses(userId) {
  if (userId) entries.delete(`${privateScope(userId)}:addresses`);
}

export function publishCartUpdate(userId, cart) {
  invalidateCart(userId);
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { userId, cart } }));
}

export function clearPrivateCache() {
  for (const key of entries.keys()) if (key.startsWith("private:")) entries.delete(key);
  for (const key of inFlight.keys()) if (key.startsWith("private:")) inFlight.delete(key);
}

export const cacheTtl = { static: STATIC_TTL, catalogue: CATALOGUE_TTL, search: SEARCH_TTL, cart: CART_TTL, addresses: ADDRESS_TTL };

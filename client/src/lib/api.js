
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Generic request helper
async function request(path, options = {}) {
  const resp = await fetch(API_BASE_URL + path, {
    credentials: "include", // allows cookies if backend sets them
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await resp.json();
  } catch (e) {
    // ignore parse error if no JSON body
  }

  return { status: resp.status, data };
}

// POST helper: send JSON body
export function postJson(path, body) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Optional GET helper if you need it later
export function getJson(path) {
  return request(path, { method: "GET" });
}

export const API_BASE_URL = "http://localhost:5000";

export const apiGet = async (path) => {
  const res = await fetch(`${API_BASE_URL}${path}`);

  if (!res.ok) {
    throw new Error(`GET ${path} failed`);
  }

  return res.json();
};

export const apiPost = async (path, body = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`POST ${path} failed`);
  }

  return res.json();
};
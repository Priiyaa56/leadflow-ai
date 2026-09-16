const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const api = {
  health: () => request("/health"),
  leads: () => request("/leads"),
  lead: (id) => request(`/leads/${id}`),
  createLead: (lead) =>
    request("/leads", { method: "POST", body: JSON.stringify(lead) }),
  approve: (id) =>
    request(`/leads/${id}/approve`, { method: "POST" }),
  regenerate: (id) =>
    request(`/leads/${id}/regenerate`, { method: "POST" }),
  createTask: (id, task) =>
    request(`/leads/${id}/task`, { method: "POST", body: JSON.stringify(task) }),
  activity: () => request("/activity")
};

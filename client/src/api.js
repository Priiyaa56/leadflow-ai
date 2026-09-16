const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const api = {
  // Health
  health: () => request("/health"),

  // Leads
  leads: () => request("/leads"),

  lead: (id) => request(`/leads/${id}`),

  createLead: (lead) =>
    request("/leads", {
      method: "POST",
      body: JSON.stringify(lead)
    }),

  approve: (id) =>
    request(`/leads/${id}/approve`, {
      method: "POST"
    }),

  regenerate: (id) =>
    request(`/leads/${id}/regenerate`, {
      method: "POST"
    }),

  // Tasks
  createTask: (id, task) =>
    request(`/leads/${id}/task`, {
      method: "POST",
      body: JSON.stringify(task)
    }),

  tasks: () =>
    request("/tasks"),

  completeTask: (id) =>
    request(`/tasks/${id}/complete`, {
      method: "POST"
    }),

  // Delete lead
  deleteLead: (id) =>
    request(`/leads/${id}`, {
      method: "DELETE"
    }),

  // Activity
  activity: () => request("/activity")
};
const API_BASE = "https://pusher-eggbeater-undermine.ngrok-free.dev";

export const scanJob = async (content) => {
  const response = await fetch(`${API_BASE}/api/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true"
    },
    body: JSON.stringify({
      input_type: "text",
      content: content
    })
  });
  return response.json();
};

export const getStats = async () => {
  const response = await fetch(`${API_BASE}/api/stats`, {
    headers: { "ngrok-skip-browser-warning": "true" }
  });
  return response.json();
};

export const getReports = async (city = null) => {
  const url = city
    ? `${API_BASE}/api/reports/feed?city=${city}`
    : `${API_BASE}/api/reports/feed`;
  const response = await fetch(url, {
    headers: { "ngrok-skip-browser-warning": "true" }
  });
  return response.json();
};

export const submitReport = async (data) => {
  const response = await fetch(`${API_BASE}/api/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true"
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const getVerifiedJobs = async () => {
  const response = await fetch(`${API_BASE}/api/jobs/verified`, {
    headers: { "ngrok-skip-browser-warning": "true" }
  });
  return response.json();
};

const BASE_URL = "http://localhost:8000";

export const createClient = async (clientData) => {
  const res = await fetch(`${BASE_URL}/clients/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clientData),
  });
  return res.json();
};

export const getAllClients = async () => {
  const res = await fetch(`${BASE_URL}/clients/all`);
  return res.json();
};

export const getMasterStats = async () => {
  const res = await fetch(`${BASE_URL}/master/stats`);
  return res.json();
};

export const getDashboard = async () => {
  const res = await fetch(`${BASE_URL}/master/dashboard`);
  return res.json();
};

export const getAllIssues = async () => {
  const res = await fetch(`${BASE_URL}/issues/all`);
  return res.json();
};

export const reportIssue = async (issueData) => {
  const res = await fetch(`${BASE_URL}/issues/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(issueData),
  });
  return res.json();
};
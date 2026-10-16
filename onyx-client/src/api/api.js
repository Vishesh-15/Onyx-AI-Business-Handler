const BASE_URL = "http://localhost:8000";

export const loginClient = async (uid, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, password }),
  });
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
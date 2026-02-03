import { Report } from "@/lib/types";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const api = axios.create({
  baseURL: `${baseURL}/api/v1/admin`,
  withCredentials: true,
});

export const login = async (creds: { username: string; password: string }) => {
  const { data } = await api.post("/login", creds);
  if (data?.success) return data.data;
  return data;
};

export const logout = async () => {
  const { data } = await api.get("/logout");
  if (data?.success) return data.data;
  return data;
};

export const dashboard = async () => {
  const { data } = await api.get("/dashboard");
  if (data?.success) return data.data;
  return data;
};

export const userStats = async () => {
  const { data } = await api.get("/user-stats");
  if (data?.success) return data.data;
  return data;
};

export const getUsers = async () => {
  const { data } = await api.get("/users");
  if (data?.success) return data.data;
  return data;
};

export const getReports = async () => {
  const { data } = await api.get("/reports");
  if (data?.success) return data.data;
  return data;
};

export const reportsOverview = async () => {
  const { data } = await api.get("/reports-overview");
  if (data?.success) return data.data;
  return data;
};

export const reportAnalytics = async (
  period: "weekly" | "monthly" | "yearly",
) => {
  const { data } = await api.get("/report-analytics", {
    params: { period },
  });
  if (data?.success) return data.data;
  return data;
};

export const deleteReport = async (reportId: string) => {
  const { data } = await api.delete(`/reports/${reportId}`);
  if (data?.success) return data.data;
  return data;
};

export const updateReport = async (
  reportId: string,
  status: Report["status"],
) => {
  const { data } = await api.put(`/reports/${reportId}`, { status });
  if (data?.success) return data.data;
  return data;
};

export const growth = async (period: string) => {
  const { data } = await api.get("/growth", {
    params: {
      query: period,
    },
  });
  if (data?.success) return data.data;
  return data;
};

export const getEntity = async (id: string, kind: string) => {
  const { data } = await api.get("/entity", {
    params: {
      entityId: id,
      kind,
    },
  });
  if (data?.success) return data.data;
  return data;
};

export const getMessages = async (id: string) => {
  const { data } = await api.get(`/messages/${id}`);
  if (data?.success) return data.data;
  return data;
};

export const usersActivity = async () => {
  const { data } = await api.get("/users-activity");
  if (data?.success) return data.data;
  return data;
};

export const contentDistribution = async () => {
  const { data } = await api.get("/content-distribution");
  if (data?.success) return data.data;
  return data;
};

export const analytics = async () => {
  const { data } = await api.get("/analytics");
  if (data?.success) return data.data;
  return data;
};

export const messageAnalytics = async () => {
  const { data } = await api.get("/message-analytics");
  if (data?.success) return data.data;
  return data;
};

export const removeUnverifiedUsers = async () => {
  const { data } = await api.delete("/unverified-users");
  if (data?.success) return data.data;
  return data;
};

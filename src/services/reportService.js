import httpClient from "./httpClient";
export const reportsService = {
  getSummary: () => httpClient.get("/Report/summary"),
  getDashboardSummary: () => httpClient.get("/Dashboard/summary")
};

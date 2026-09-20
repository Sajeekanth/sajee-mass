import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const getReleasesByProjectId = async (projectId: string | number) => {
  const response = await apiClient.get(ENDPOINTS.releaseByProject(Number(projectId)));
  return response.data?.data || [];
};

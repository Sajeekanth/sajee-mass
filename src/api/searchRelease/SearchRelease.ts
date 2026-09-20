import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const getReleasesByProjectId = async (projectId: string | number) => {
  const response = await apiClient.get(ENDPOINTS.releaseByProject(Number(projectId)));
  return response.data?.data || [];
};

export async function searchReleases(params: any) {
  if (typeof params === 'number' || (typeof params === 'string' && !isNaN(Number(params)))) {
    const response = await apiClient.get(ENDPOINTS.releaseById(Number(params)));
    return response.data?.data;
  }
  const response = await apiClient.get(ENDPOINTS.release);
  return response.data?.data || [];
}

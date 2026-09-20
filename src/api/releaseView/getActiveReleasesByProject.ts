import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface ActiveRelease {
  id: string;
  name: string;
  status: string;
}

export const getActiveReleasesByProject = async (
  projectId: string | number
): Promise<ActiveRelease[]> => {
  const response = await apiClient.get(ENDPOINTS.releaseActiveByProject(Number(projectId)));
  const list = Array.isArray(response.data?.data) ? response.data.data : [];
  return list.map((r: any) => ({
    id: String(r.id),
    name: r.name || r.releaseName || 'Release',
    status: r.status || 'ACTIVE',
  }));
};
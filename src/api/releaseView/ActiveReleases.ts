import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface ActiveRelease {
  id: string;
  releaseId: string;
  name: string;
  description: string;
  status: string;
  releaseDate: string;
  releaseType_id: string;
  project_id: number;
}

export interface ActiveReleasesResponse {
  message: string;
  data: ActiveRelease[];
  status: string;
  statusCode: string;
}

export const getActiveReleases = async (projectId: string | number): Promise<ActiveReleasesResponse> => {
  const response = await apiClient.get(ENDPOINTS.releaseActiveByProject(Number(projectId)));
  const list = Array.isArray(response.data?.data) ? response.data.data : [];
  return {
    message: response.data?.message || 'Success',
    status: response.data?.status || 'success',
    statusCode: String(response.data?.statusCode || 200),
    data: list.map((r: any) => ({
      id: String(r.id),
      releaseId: String(r.id),
      name: r.name || r.releaseName || 'Release',
      description: r.description || '',
      status: r.status || 'ACTIVE',
      releaseDate: r.releaseDate || '',
      releaseType_id: String(r.releaseTypeId || r.releaseType_id || ''),
      project_id: Number(projectId),
    })),
  };
};
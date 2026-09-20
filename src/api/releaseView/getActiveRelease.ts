import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const getActiveRelease = async (projectId: string | number) => {
  const response = await apiClient.get(ENDPOINTS.releaseActiveByProject(Number(projectId)));
  const list = Array.isArray(response.data?.data) ? response.data.data : [];
  return {
    status: response.data?.status || 'success',
    statusCode: response.data?.statusCode || 200,
    data: list.map((r: any) => ({
      ...r,
      releaseName: r.name || r.releaseName,
    })),
  };
};

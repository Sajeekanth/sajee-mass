import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface UpdateReleaseStatusResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  data: {
    id: number;
    name: string;
    status: string;
  };
}

export const updateReleaseStatus = async (releaseId: number, status: 'ACTIVE' | 'HOLD'): Promise<UpdateReleaseStatusResponse> => {
  const response = await apiClient.put(ENDPOINTS.releaseStatus(releaseId), { status });
  const releaseData = response.data?.data;
  return {
    status: response.data?.status || 'success',
    statusCode: response.data?.statusCode || 200,
    statusMessage: response.data?.message || 'Release status updated successfully',
    data: {
      id: releaseData?.id || releaseId,
      name: releaseData?.name || releaseData?.releaseName || 'Release',
      status: releaseData?.status || status,
    },
  };
};
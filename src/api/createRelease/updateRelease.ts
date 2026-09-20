import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export async function updateRelease(id: number, data: any) {
  const payload = {
    name: data.name,
    version: data.version,
    releaseDate: data.releaseDate,
    releaseTypeId: Number(data.releaseType_id || data.releaseTypeId),
    projectId: data.project_id ? Number(data.project_id) : undefined,
    description: data.description,
    status: data.status,
  };

  const response = await apiClient.put(ENDPOINTS.releaseById(id), payload);
  return {
    status: response.data?.status || 'success',
    statusCode: response.data?.statusCode || 200,
    message: response.data?.message || 'Release updated successfully',
    data: response.data?.data,
  };
}

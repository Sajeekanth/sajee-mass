import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export async function deleteReleaseById(id: number) {
  const response = await apiClient.delete(ENDPOINTS.releaseById(id));
  return {
    status: response.data?.status || 'success',
    statusCode: response.data?.statusCode || 200,
    message: response.data?.message || 'Release deleted successfully',
  };
}

export const deleteRelease = deleteReleaseById;
import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const deleteModule = async (projectId: number, id: number): Promise<{ status: string; statusCode?: string; data?: any[]; message?: string }> => {
  const response = await apiClient.delete(ENDPOINTS.moduleById(Number(projectId), Number(id)));
  return {
    status: response.data?.status || 'success',
    statusCode: String(response.data?.statusCode || 200),
    message: response.data?.message || 'Module deleted successfully',
    data: response.data?.data,
  };
};

import { Module } from "../../types/index";
import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const updateModule = async (
  projectId: number,
  id: number,
  data: Partial<Module>
): Promise<{ success: boolean; module?: Module; message?: string }> => {
  const response = await apiClient.put(ENDPOINTS.moduleById(Number(projectId), Number(id)), {
    name: data.name,
    description: data.description,
    leaderId: data.assignedLeaderId ?? data.leaderId,
  });

  return {
    success: true,
    module: response.data?.data as any,
    message: response.data?.message || 'Module updated successfully',
  };
};

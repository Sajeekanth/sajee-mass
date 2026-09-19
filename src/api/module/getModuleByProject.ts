import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

interface Modules {
  id: number;
  name: string;
  projectId: number;
  submodules?: any[];
  assignedDevs?: string[];
}

export interface CreateReleaseResponse {
  status: string;
  message: string;
  data: Modules[];
  statusCode: number;
}

export const getModulesByProject = async (projectId: number): Promise<CreateReleaseResponse> => {
  const response = await apiClient.get(ENDPOINTS.module(Number(projectId)));
  const rawList = Array.isArray(response.data?.data) ? response.data.data : [];
  return {
    status: response.data?.status || 'success',
    message: response.data?.message || 'Modules fetched successfully',
    statusCode: response.data?.statusCode || 200,
    data: rawList.map((m: any) => ({
      id: m.id,
      name: m.name || 'Module',
      projectId: m.projectId,
      submodules: m.submodules || [],
      assignedDevs: Array.isArray(m.assignedDevs)
        ? m.assignedDevs.map((d: any) => (typeof d === 'string' ? d : d.employeeName))
        : [],
    })),
  };
};
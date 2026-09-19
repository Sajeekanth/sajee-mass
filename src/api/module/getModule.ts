import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface Modules {
  id: number;
  name: string;
  projectId: number;
  assignedDev: {
    userId: number;
    userName: string;
  } | null;
  submodules?: any[];
}

export interface CreateReleaseResponse {
  status: string;
  message: string;
  data: Modules[];
  statusCode: number;
}

export const getModulesByProjectId = async (projectId: number): Promise<CreateReleaseResponse> => {
  const response = await apiClient.get(ENDPOINTS.module(Number(projectId)));
  const rawList = Array.isArray(response.data?.data) ? response.data.data : [];
  return {
    status: response.data?.status || 'success',
    message: response.data?.message || 'Modules fetched successfully',
    statusCode: response.data?.statusCode || 200,
    data: rawList.map((m: any) => ({
      id: m.id,
      name: m.name,
      projectId: m.projectId,
      assignedDev: m.leaderId ? {
        userId: m.leaderId,
        userName: m.leaderName || 'Module Leader',
      } : null,
      submodules: m.submodules || [],
    })),
  };
};

export async function getAllocatedUsersByModuleId(moduleId: string | number) {
  const response = await apiClient.get(ENDPOINTS.subModuleDev(Number(moduleId)));
  const list = Array.isArray(response.data?.data) ? response.data.data : [];
  return list;
}

export async function getUsersByAllocation(projectId: string | number, _moduleId: string | number, _subModuleId?: string | number) {
  const response = await apiClient.get(`${ENDPOINTS.projectAllocation}/${projectId}`);
  const envelope = response.data;
  const list = Array.isArray(envelope?.data?.content)
    ? envelope.data.content
    : Array.isArray(envelope?.data)
    ? envelope.data
    : [];
  return list;
}

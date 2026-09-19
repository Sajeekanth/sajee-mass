import apiClient from "../../lib/api";

export interface AllocateModuleLeaderRequest {
  projectId: number;
  moduleId: number;
  userId: number;
}

export interface AllocatedLeaderResponse {
  allocateModuleId: number;
  moduleId: number;
  userId: number;
  userName?: string;
}

export const allocateModuleLeader = async (data: AllocateModuleLeaderRequest) => {
  const response = await apiClient.post('/api/v1/allocate-module-leader', {
    projectId: Number(data.projectId),
    moduleId: Number(data.moduleId),
    employeeId: Number(data.userId),
    userId: Number(data.userId),
  });

  return {
    status: response.data?.status || 'success',
    statusCode: response.data?.statusCode || 201,
    message: response.data?.message || 'Leader allocated successfully',
    data: response.data?.data,
  };
};

export const getAllocatedLeader = async (moduleId: number): Promise<AllocatedLeaderResponse | null> => {
  try {
    const response = await apiClient.get(`/api/v1/module/${moduleId}`);
    const mod = response.data?.data;
    if (!mod || !mod.leaderId) return null;
    return {
      allocateModuleId: mod.allocatedModuleId || mod.id,
      moduleId: mod.id,
      userId: mod.leaderId,
      userName: mod.leaderName || 'Leader',
    };
  } catch {
    return null;
  }
};

export const deallocateModuleLeader = async (allocateModuleId: number) => {
  const response = await apiClient.delete(`/api/v1/allocate-module-leader/${allocateModuleId}`);
  return {
    status: response.data?.status || 'success',
    statusCode: response.data?.statusCode || 200,
    message: response.data?.message || 'Leader deallocated successfully',
    data: { allocateModuleId },
  };
};
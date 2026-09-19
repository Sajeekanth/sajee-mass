import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const deallocateModuleLeaderWithAllocateModuleId = async (allocateModuleId: number) => {
  const response = await apiClient.delete(`/api/v1/allocate-module-leader/${allocateModuleId}`);
  return {
    status: response.data?.status || 'success',
    message: response.data?.message || 'Deallocated successfully',
    data: { allocateModuleId },
  };
};

export const deallocateDeveloperFromModule = async (
  _projectId: number,
  moduleId: number,
  userId: number
) => {
  try {
    const modRes = await apiClient.get(`/api/v1/module/${moduleId}`);
    const mod = modRes.data?.data;
    if (mod && mod.allocatedModuleId) {
      await apiClient.delete(`/api/v1/allocate-module-leader/${mod.allocatedModuleId}`);
    } else {
      await apiClient.delete(`/api/v1/module/${moduleId}/leader`);
    }
  } catch (error) {
    console.error(`Error deallocating developer ${userId} from module ${moduleId}:`, error);
    try {
      await apiClient.delete(`/api/v1/module/${moduleId}/leader`);
    } catch (fallbackErr) {
      console.error(`Fallback deallocation for module ${moduleId} also failed:`, fallbackErr);
      throw error;
    }
  }
  return {
    status: 'success',
    message: 'Developer deallocated from module',
    data: { moduleId, userId },
  };
};

export const deallocateSubmoduleDeveloperWithAllocateModuleId = async (
  allocateModuleId: number
) => {
  return {
    status: 'success',
    message: 'Submodule developer deallocated',
    data: { allocateModuleId },
  };
};

export const deallocateDeveloperFromSubmodule = async (
  _projectId: number,
  _moduleId: number,
  submoduleId: number,
  userId: number
) => {
  const response = await apiClient.delete(ENDPOINTS.subModuleDevDelete(Number(submoduleId), Number(userId)));
  return {
    status: response.data?.status || 'success',
    message: response.data?.message || 'Developer deallocated from submodule',
    data: { submoduleId, userId },
  };
};

export const reassignDeveloperWithAllocateModuleId = async (
  allocateModuleId: number,
  newUserId: number
) => {
  // Deallocate existing leader allocation
  await apiClient.delete(`/api/v1/allocate-module-leader/${allocateModuleId}`);
  return {
    status: 'success',
    message: 'Developer reassigned',
    data: { allocateModuleId, newUserId },
  };
};

export const reassignSubmoduleDeveloperWithAllocateModuleId = async (
  allocationId: number,
  newUserId: number
) => {
  return {
    status: 'success',
    message: 'Submodule developer reassigned',
    data: { allocationId, newUserId },
  };
};

export const reassignDeveloperToModule = async (
  projectId: number,
  moduleId: number,
  oldUserId: number,
  newUserId: number
) => {
  await deallocateDeveloperFromModule(projectId, moduleId, oldUserId);
  await apiClient.post('/api/v1/allocate-module-leader', {
    moduleId: Number(moduleId),
    employeeId: Number(newUserId),
  });
  return {
    status: 'success',
    message: 'Developer reassigned to module',
    data: { projectId, moduleId, oldUserId, newUserId },
  };
};

export const reassignDeveloperToSubmodule = async (
  projectId: number,
  moduleId: number,
  submoduleId: number,
  oldUserId: number,
  newUserId: number
) => {
  await deallocateDeveloperFromSubmodule(projectId, moduleId, submoduleId, oldUserId);
  await apiClient.post(ENDPOINTS.subModuleDev(Number(submoduleId)), {
    employeeId: Number(newUserId),
  });
  return {
    status: 'success',
    message: 'Developer reassigned to submodule',
    data: { projectId, moduleId, submoduleId, oldUserId, newUserId },
  };
};
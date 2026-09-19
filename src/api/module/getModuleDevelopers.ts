import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const getDevelopersByModuleId = async (_projectId: number, moduleId: number) => {
  try {
    const response = await apiClient.get(`/api/v1/module/${moduleId}`);
    const mod = response.data?.data;
    if (!mod) return [];

    if (mod.leaderId) {
      return [{
        id: mod.leaderId,
        employeeId: mod.leaderId,
        userId: mod.leaderId,
        projectAllocationId: mod.leaderId,
        name: mod.leaderName || `Leader ${mod.leaderId}`,
        userName: mod.leaderName || `Leader ${mod.leaderId}`,
        email: mod.leaderEmail || "",
        designation: "Module Leader",
        subModuleId: null,
        allocateModuleId: mod.allocatedModuleId || mod.id,
      }];
    }
    return [];
  } catch (error) {
    console.error(`Failed to get developers for module ${moduleId}:`, error);
    return [];
  }
};

export const getDevelopersBySubmoduleId = async (_projectId: number, _moduleId: number, submoduleId: number) => {
  try {
    const response = await apiClient.get(ENDPOINTS.subModuleDev(Number(submoduleId)));
    const devs = Array.isArray(response.data?.data) ? response.data.data : [];
    return devs.map((dev: any) => ({
      id: dev.employeeId,
      employeeId: dev.employeeId,
      userId: dev.employeeId,
      name: dev.employeeName,
      userName: dev.employeeName,
      email: dev.email || "",
      designation: dev.designation || "Developer",
      subModuleId: submoduleId,
    }));
  } catch (error) {
    console.error(`Failed to get developers for submodule ${submoduleId}:`, error);
    return [];
  }
};
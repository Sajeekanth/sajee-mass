import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface UserByAllocation {
  userId: number;
  userName: string;
  userRole?: string;
  userWithRole: string;
  allocateModuleId?: number;
  allocationId?: number;
  moduleName?: string;
  projectName?: string;
  moduleId?: number;
  projectId?: number;
  subModuleId?: number;
}

export const getUsersByAllocation = async (projectId: number, moduleId: number): Promise<UserByAllocation[]> => {
  try {
    const response = await apiClient.get(`/api/v1/module/${moduleId}/leader`);
    const leader = response.data?.data;
    if (!leader || !leader.employeeId) {
      return [];
    }

    return [{
      allocateModuleId: leader.allocatedModuleId,
      allocationId: leader.allocatedModuleId,
      moduleId: leader.moduleId || moduleId,
      moduleName: leader.moduleName,
      userId: leader.employeeId,
      userName: leader.employeeName || `User ${leader.employeeId}`,
      userRole: "Module Leader",
      userWithRole: `${leader.employeeName || `User ${leader.employeeId}`} - ${leader.roleName || "Module Leader"}`,
      projectId: projectId,
    }];
  } catch (error) {
    console.error(`Failed to fetch module leader allocation for module ${moduleId}:`, error);
    return [];
  }
};

export const getUsersBySubmoduleAllocation = async (
  projectId: number,
  moduleId: number,
  subModuleId: number
): Promise<UserByAllocation[]> => {
  try {
    const response = await apiClient.get(ENDPOINTS.subModuleDev(Number(subModuleId)));
    const list = Array.isArray(response.data?.data) ? response.data.data : [];
    return list.map((u: any) => ({
      allocationId: u.allocationId || u.employeeId,
      userId: u.employeeId,
      userName: u.employeeName || `User ${u.employeeId}`,
      userRole: u.designation || 'Developer',
      userWithRole: `${u.employeeName || `User ${u.employeeId}`} - ${u.designation || 'Developer'}`,
      moduleId,
      projectId,
      subModuleId,
    }));
  } catch (error) {
    console.error(`Failed to fetch submodule developer allocations for submodule ${subModuleId}:`, error);
    return [];
  }
};

export async function getUsersByModuleSubmoduleAllocation(projectId: number) {
  try {
    const response = await apiClient.get(`/api/v1/project/${projectId}/module-allocation/developers`);
    const list = Array.isArray(response.data?.data) ? response.data.data : [];
    return {
      status: 'success',
      message: 'Developers retrieved successfully',
      data: list.map((u: any) => ({
        employeeId: u.employeeId,
        firstName: u.firstName,
        lastName: u.lastName,
        employeeName: u.employeeName || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
        roleName: u.roleName || u.designation || 'Developer',
        roleType: u.roleType || 'DEVELOPER',
        designation: u.designation || u.roleName || 'Developer',
        projectId: u.projectId || projectId,
        moduleId: u.moduleId,
        submoduleId: u.submoduleId,
      })),
      statusCode: 200,
    };
  } catch (error) {
    console.error(`Failed to fetch project module developers for project ${projectId}:`, error);
    return {
      status: 'error',
      message: 'Failed to retrieve developers',
      data: [],
      statusCode: 500,
    };
  }
}
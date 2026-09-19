import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

export interface SubModuleDevResponse {
  status: string;
  statusCode: number | string;
  statusMessage: string;
  data: SubModuleDevAllocation[];
}

export interface SubModuleDevAllocation {
  id: number | string;
  employeeId: number | string;
  submoduleId: number | string;
  employeeName?: string;
}

export const getAllSubmoduleAllocatedDevBySubmoduleId = async (
  subModuleId: number
): Promise<SubModuleDevResponse> => {
  const response = await apiClient.get(ENDPOINTS.subModuleDev(Number(subModuleId)));
  const list = Array.isArray(response.data?.data) ? response.data.data : [];
  return {
    status: response.data?.status || 'success',
    statusCode: response.data?.statusCode || 200,
    statusMessage: response.data?.message || 'Success',
    data: list.map((d: any) => ({
      id: d.allocationId || d.employeeId,
      employeeId: d.employeeId,
      submoduleId: d.submoduleId || subModuleId,
      employeeName: d.employeeName,
    })),
  };
};

export const allocateProjectEmployeeToSubModule = async (
  subModuleId: number,
  employeeId: number
): Promise<SubModuleDevResponse> => {
  const response = await apiClient.post(ENDPOINTS.subModuleDev(Number(subModuleId)), {
    employeeId: Number(employeeId),
  });
  const resData = response.data?.data;
  return {
    status: response.data?.status || 'success',
    statusCode: response.data?.statusCode || 201,
    statusMessage: response.data?.message || 'Developer allocated to submodule successfully',
    data: resData ? [{
      id: resData.allocationId || resData.employeeId || employeeId,
      employeeId: resData.employeeId || employeeId,
      submoduleId: resData.submoduleId || subModuleId,
      employeeName: resData.employeeName,
    }] : [],
  };
};

export const deAllocateProjectEmployeeFromSubModule = async (
  subModuleId: number,
  employeeId: number
): Promise<SubModuleDevResponse> => {
  const response = await apiClient.delete(ENDPOINTS.subModuleDevDelete(Number(subModuleId), Number(employeeId)));
  return {
    status: response.data?.status || 'success',
    statusCode: response.data?.statusCode || 200,
    statusMessage: response.data?.message || 'Developer deallocated from submodule successfully',
    data: [],
  };
};

import { CreateModuleRequest, CreateModuleResponse } from "../../types/index";
import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const createModule = async (data: CreateModuleRequest): Promise<CreateModuleResponse> => {
  const response = await apiClient.post(ENDPOINTS.module(Number(data.projectId)), {
    name: data.name,
    description: (data as any).description,
    leaderId: (data as any).leaderId,
    projectId: Number(data.projectId),
  });

  const resData = response.data?.data;
  return {
    status: response.data?.status || "success",
    statusCode: String(response.data?.statusCode || 201),
    message: response.data?.message || "Module created successfully",
    data: Array.isArray(resData) ? resData : (resData ? [resData] : []),
    success: true,
  };
};

export const createSubmodule = async (data: { name?: string; subModuleName?: string; moduleId: number; description?: string; assignedDevIds?: number[] }) => {
  const name = data.name || data.subModuleName || "";
  const response = await apiClient.post(ENDPOINTS.subModule(Number(data.moduleId)), {
    name,
    subModuleName: name,
    description: data.description,
    assignedDevIds: data.assignedDevIds,
  });

  return {
    status: response.data?.status || "success",
    message: response.data?.message || "Submodule created successfully",
    data: response.data?.data,
  };
};

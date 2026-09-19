import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const getSubmodulesByModule = async (moduleId: number) => {
  const response = await apiClient.get(ENDPOINTS.subModule(Number(moduleId)));
  const submodules = Array.isArray(response.data?.data) ? response.data.data : [];
  return {
    status: response.data?.status || 'success',
    statusCode: response.data?.statusCode || 200,
    data: submodules.map((s: any) => ({
      ...s,
      subModuleName: s.name || s.subModuleName,
    })),
  };
};

export const getSubmodulesByModuleId = getSubmodulesByModule;

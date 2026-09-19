import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface Submodule {
  id: number;
  name: string;
  submoduleName?: string;
  subModuleName?: string;
  getSubModuleName?: string;
}

export interface GetSubmodulesResponse {
  status: string;
  message: string;
  data: Submodule[];
  statusCode: number;
}

export const getSubmodulesByModule = async (moduleId: number): Promise<GetSubmodulesResponse> => {
  const response = await apiClient.get(ENDPOINTS.subModule(Number(moduleId)));
  const submodules = Array.isArray(response.data?.data) ? response.data.data : [];
  return {
    status: response.data?.status || 'success',
    message: response.data?.message || 'Submodules fetched successfully',
    statusCode: response.data?.statusCode || 200,
    data: submodules.map((s: any) => ({
      id: s.id,
      name: s.name || s.subModuleName || 'Submodule',
      submoduleName: s.name || s.subModuleName || 'Submodule',
      subModuleName: s.name || s.subModuleName || 'Submodule',
      getSubModuleName: s.name || s.subModuleName || 'Submodule',
    })),
  };
};

export const getSubmodulesByModuleId = async (moduleId: number): Promise<GetSubmodulesResponse> => {
  return getSubmodulesByModule(moduleId);
};

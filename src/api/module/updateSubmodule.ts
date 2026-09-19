import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const updateSubmodule = async (
  submoduleId: number,
  moduleId: number,
  data: { name?: string; subModuleName?: string; description?: string; assignedDevIds?: number[] }
) => {
  const name = data.name || data.subModuleName || "";
  const response = await apiClient.put(ENDPOINTS.subModuleById(Number(moduleId), Number(submoduleId)), {
    name,
    subModuleName: name,
    description: data.description,
    assignedDevIds: data.assignedDevIds,
  });

  return {
    status: response.data?.status || "success",
    message: response.data?.message || "Submodule updated successfully",
    data: response.data?.data,
  };
};
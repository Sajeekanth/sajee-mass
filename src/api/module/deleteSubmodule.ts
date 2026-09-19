import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const deleteSubmodule = async (submoduleId: number, moduleId: number) => {
  const response = await apiClient.delete(ENDPOINTS.subModuleById(Number(moduleId), Number(submoduleId)));
  return {
    status: response.data?.status || "success",
    message: response.data?.message || "Submodule deleted successfully",
    data: { submoduleId, moduleId },
  };
};
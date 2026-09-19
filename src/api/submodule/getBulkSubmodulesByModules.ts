import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface BulkSubmodule {
  subModuleId: number;
  subModuleName: string;
  moduleId: number;
  moduleName: string;
}

export const getBulkSubmodulesByModules = async (
  projectId: string | number,
  moduleIds: number[] | string
): Promise<BulkSubmodule[]> => {
  const ids = Array.isArray(moduleIds)
    ? moduleIds.map(Number)
    : String(moduleIds).split(',').map(Number).filter(n => !isNaN(n) && n > 0);

  if (ids.length === 0) {
    return [];
  }

  try {
    const response = await apiClient.post(ENDPOINTS.subModuleBulk(), { moduleIds: ids });
    const list = Array.isArray(response.data?.data) ? response.data.data : [];
    return list.map((s: any) => ({
      subModuleId: s.id,
      subModuleName: s.name || s.subModuleName || 'Submodule',
      moduleId: s.moduleId,
      moduleName: s.moduleName || 'Module',
    }));
  } catch {
    return [];
  }
};

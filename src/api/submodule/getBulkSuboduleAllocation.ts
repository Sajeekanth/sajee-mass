import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const getBulkSuboduleAllocation = async (
  projectId: number,
  moduleId: number,
  submoduleId: number
) => {
  try {
    const response = await apiClient.get(ENDPOINTS.subModuleDev(Number(submoduleId)));
    const list = Array.isArray(response.data?.data) ? response.data.data : [];
    return list.map((item: any) => ({
      id: item.allocationId || item.employeeId,
      allocationId: item.allocationId,
      employeeId: item.employeeId,
      employeeName: item.employeeName,
      name: item.employeeName,
      userName: item.employeeName,
      role: item.designation || "Developer",
      designation: item.designation || "Developer",
      projectId,
      moduleId,
      submoduleId,
    }));
  } catch (error) {
    console.error(`Error fetching submodule allocations for submodule ${submoduleId}:`, error);
    return [];
  }
};
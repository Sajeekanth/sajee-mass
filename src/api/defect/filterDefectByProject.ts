import { FilteredDefect } from "../../types";
import apiClient from "../../lib/api";

export async function getDefectsByProjectId(
  projectId: number,
  page: number = 0,
  size: number = 10,
  search?: string
): Promise<any> {
  const params: Record<string, any> = {
    page,
    size,
  };
  if (search && search.trim() !== '') {
    params.search = search.trim();
  }

  try {
    const response = await apiClient.get(`/api/v1/project/${projectId}/defect`, { params });
    const paged = response.data?.data || {};
    const content = paged.content || [];

    const mapped = content.map((d: any) => ({
      id: d.id,
      defectId: d.defectNo || d.defectId,
      defectNo: d.defectNo || d.defectId,
      description: d.description || d.title,
      reOpenCount: d.reOpenCount || 0,
      attachment: d.attachment || null,
      steps: d.steps || '',
      projectName: d.projectName,
      severityName: d.severityName || 'Medium',
      priorityName: d.priorityName || 'Medium',
      statusName: d.statusName || d.status,
      defect_status_name: d.defect_status_name || d.statusName || d.status,
      defect_status_id: d.defect_status_id || d.statusId || 1,
      releaseName: d.releaseName,
      assignedToName: d.assignedToName || d.assignedTo,
      assignedByName: d.assignedByName || d.assignedBy,
      assigned_to_name: d.assigned_to_name || d.assignedToName || d.assignedTo,
      assigned_by_name: d.assigned_by_name || d.assignedByName || d.assignedBy,
      assigned_to_id: d.assigned_to_id || d.assignedToId,
      assigned_by_id: d.assigned_by_id || d.assignedById,
      defectTypeName: d.defectTypeName || 'Functional Bug',
      defect_type_name: d.defect_type_name || d.defectTypeName || 'Functional Bug',
      moduleName: d.moduleName,
      module_name: d.module_name || d.moduleName,
      subModuleName: d.subModuleName,
      sub_module_name: d.sub_module_name || d.subModuleName,
      testCaseId: d.testCaseId,
    }));

    return {
      status: response.data?.status || 'success',
      statusCode: response.data?.statusCode || 200,
      data: {
        content: mapped,
        totalElements: paged.totalElements || mapped.length,
        totalPages: paged.totalPages || 1,
        size: paged.size || size,
        number: paged.number || page,
      },
      content: mapped,
    };
  } catch (error: any) {
    console.error("Failed to fetch defects:", error);
    return {
      status: 'error',
      statusCode: error?.response?.status || 500,
      data: { content: [], totalElements: 0, totalPages: 0, size, number: page },
      content: [],
    };
  }
}

export async function filterDefects(
  filters: any,
  page: number = 0,
  size: number = 10
): Promise<any> {
  const projectId = Number(filters?.projectId || 1);
  const params: Record<string, any> = { page, size };
  if (filters?.search) params.search = filters.search;
  if (filters?.moduleId) params.moduleId = filters.moduleId;
  if (filters?.subModuleId) params.subModuleId = filters.subModuleId;
  if (filters?.releaseId) params.releaseId = filters.releaseId;
  if (filters?.severityId) params.severityId = filters.severityId;
  if (filters?.priorityId) params.priorityId = filters.priorityId;
  if (filters?.statusId) params.statusId = filters.statusId;
  if (filters?.assignedToId) params.assignedToId = filters.assignedToId;

  try {
    const response = await apiClient.get(`/api/v1/project/${projectId}/defect`, { params });
    const paged = response.data?.data || {};
    const content = paged.content || [];

    const mapped = content.map((d: any) => ({
      ...d,
      defectId: d.defectNo || d.defectId,
      defect_status_name: d.defect_status_name || d.statusName || d.status,
      defect_status_id: d.defect_status_id || d.statusId,
      assigned_to_name: d.assigned_to_name || d.assignedToName || d.assignedTo,
      assigned_by_name: d.assigned_by_name || d.assignedByName || d.assignedBy,
      defect_type_name: d.defect_type_name || d.defectTypeName,
    }));

    return {
      status: 'success',
      statusCode: 200,
      data: {
        content: mapped,
        totalElements: paged.totalElements || mapped.length,
        totalPages: paged.totalPages || 1,
        size: paged.size || size,
        number: paged.number || page,
      },
      content: mapped,
    };
  } catch (error) {
    return {
      status: 'error',
      statusCode: 500,
      data: { content: [], totalElements: 0, totalPages: 0, size, number: page },
      content: [],
    };
  }
}

export async function filterDefectsForTest(filters: {
  projectId: string | number;
  releaseId?: number;
}): Promise<FilteredDefect[]> {
  const res = await getDefectsByProjectId(Number(filters.projectId), 0, 100);
  return res.content || [];
}
import apiClient from "../../lib/api";

const mapTestCaseItem = (t: any) => ({
  id: t.id,
  no: t.no || t.testcaseNo,
  testcaseNo: t.testcaseNo || t.no,
  description: t.description || "",
  detailsSteps: t.detailsSteps || t.steps || "",
  steps: t.steps || t.detailsSteps || "",
  expectedResult: t.expectedResult || "",
  subModuleId: t.subModuleId || t.submoduleId,
  subModuleName: t.subModuleName || t.subModule || "",
  moduleId: t.moduleId,
  moduleName: t.moduleName || t.module || "",
  projectId: t.projectId,
  projectName: t.projectName || "",
  severityId: t.severityId,
  severityName: t.severityName || t.severity || "",
  defectTypeId: t.defectTypeId,
  defectTypeName: t.defectTypeName || t.type || "",
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
  createdBy: t.createdBy,
  updatedBy: t.updatedBy,
});

export const getTestCasesByProjectAndSubmodule = async (
  projectId: string,
  subModuleId: string,
  description?: string,
  defectTypeId?: number,
  severityId?: number,
  page: number = 0,
  size: number = 1000
): Promise<any[]> => {
  const params: any = {
    projectId,
    page,
    size,
  };
  if (description && description.trim()) params.description = description.trim();
  if (defectTypeId) params.defectTypeId = defectTypeId;
  if (severityId) params.severityId = severityId;

  const response = await apiClient.get(`/api/v1/sub-module/${subModuleId}/test-case`, { params });
  const paged = response.data?.data;
  const content = Array.isArray(paged?.content) ? paged.content : (Array.isArray(paged) ? paged : []);
  const list = content.map(mapTestCaseItem);

  (list as any).totalPages = paged?.totalPages || 1;
  (list as any).totalElements = paged?.totalElements !== undefined ? paged.totalElements : list.length;
  (list as any).isServerPaginated = true;
  return list;
};

export async function deleteTestCase(
  _subModuleId: number,
  testCaseId: string | number
) {
  const response = await apiClient.delete(`/api/v1/test-case/${testCaseId}`);
  const payload = response.data;
  return {
    status: payload?.status || "success",
    statusCode: payload?.statusCode || response.status || 200,
    message: payload?.message || "Test case deleted successfully",
    data: payload?.data,
  };
}

export async function getTestCasesByProjectAndModule(
  projectId: string | number,
  moduleId: string | number,
  page: number = 0,
  size: number = 1000
) {
  const params: any = {
    projectId,
    page,
    size,
  };

  const response = await apiClient.get(`/api/v1/module/${moduleId}/test-case`, { params });
  const paged = response.data?.data;
  const content = Array.isArray(paged?.content) ? paged.content : (Array.isArray(paged) ? paged : []);
  const list = content.map(mapTestCaseItem);

  (list as any).totalPages = paged?.totalPages || 1;
  (list as any).totalElements = paged?.totalElements !== undefined ? paged.totalElements : list.length;
  (list as any).isServerPaginated = true;
  return list;
}

export async function getTestCasesByBulkModules(
  projectId: string | number,
  moduleIds: number[]
) {
  const all: any[] = [];
  for (const modId of moduleIds) {
    const list = await getTestCasesByProjectAndModule(projectId, modId);
    all.push(...list);
  }
  return all;
}

export async function getTestCasesByBulkSubmodules(
  projectId: string | number,
  submoduleIds: number[]
) {
  const all: any[] = [];
  for (const subId of submoduleIds) {
    const list = await getTestCasesByProjectAndSubmodule(String(projectId), String(subId));
    all.push(...list);
  }
  return all;
}

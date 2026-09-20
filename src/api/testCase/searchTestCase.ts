import apiClient from "../../lib/api";

export const searchTestCaseByCriteria = async (
  moduleId: number,
  description?: string,
  defectTypeId?: number,
  severityId?: number
) => {
  const params: any = {
    moduleId,
    page: 0,
    size: 1000,
  };
  if (description && description.trim()) params.description = description.trim();
  if (defectTypeId) params.defectTypeId = defectTypeId;
  if (severityId) params.severityId = severityId;

  const response = await apiClient.get("/api/v1/test-case", { params });
  const paged = response.data?.data;
  const content = Array.isArray(paged?.content) ? paged.content : (Array.isArray(paged) ? paged : []);
  return content.map((t: any) => ({
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
  }));
};
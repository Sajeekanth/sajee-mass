import apiClient from "../../lib/api";

export async function getTestCasesByFilter({
  projectId,
  releaseId,
  moduleId,
  subModuleId,
}: {
  projectId: number;
  releaseId: number;
  moduleId?: number;
  subModuleId?: number;
}) {
  const params: Record<string, any> = {};
  if (moduleId) params.moduleId = moduleId;
  if (subModuleId) params.subModuleId = subModuleId;

  try {
    const response = await apiClient.get(`/api/v1/release-test-cases/release/${releaseId}/test-case`, { params });
    const items = response.data?.data || [];

    return items.map((t: any) => ({
      id: t.id,
      testcaseNo: t.testcaseNo,
      description: t.description,
      detailsSteps: t.steps,
      expectedResult: t.expectedResult,
      severityName: t.severityName,
      defectTypeName: t.defectTypeName,
      subModuleName: t.subModuleName,
      moduleName: t.moduleName,
      projectId,
      releaseId,
      executionStatus: t.passOrFail || 'NOT_RUN',
      backendId: t.id,
      releaseTestCaseId: t.id,
    }));
  } catch (error) {
    console.error("Failed to fetch release test cases:", error);
    return [];
  }
}
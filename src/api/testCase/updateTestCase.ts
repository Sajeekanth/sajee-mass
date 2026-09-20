import apiClient from "../../lib/api";

export async function updateTestCase(
  subModuleId: number,
  testCaseId: string | number,
  data: any
) {
  const response = await apiClient.put(`/api/v1/test-case/${testCaseId}`, {
    subModuleId: Number(subModuleId || data.subModuleId),
    description: data.description,
    detailsSteps: data.detailsSteps || data.steps,
    expectedResult: data.expectedResult || "",
    severityId: Number(data.severityId),
    defectTypeId: Number(data.defectTypeId),
    testcaseNo: data.testcaseNo || data.no,
  });

  const payload = response.data;
  return {
    status: payload?.status || "success",
    statusCode: payload?.statusCode || response.status || 200,
    message: payload?.message || "Test case updated successfully",
    statusMessage: payload?.message || "Test case updated successfully",
    data: payload?.data,
  };
}

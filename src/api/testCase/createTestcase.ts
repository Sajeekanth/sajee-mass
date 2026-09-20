import apiClient from "../../lib/api";

export interface CreateTestCaseRequest {
  description: string;
  detailsSteps: string;
  expectedResult?: string;
  severityId: number;
  defectTypeId: number;
}

export interface CreateTestCaseResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  data: any;
}

export async function createTestCase(subModuleId: number, testCaseData: CreateTestCaseRequest) {
  const response = await apiClient.post(`/api/v1/sub-module/${subModuleId}/test-case`, {
    subModuleId: Number(subModuleId),
    description: testCaseData.description,
    detailsSteps: testCaseData.detailsSteps,
    expectedResult: testCaseData.expectedResult || "",
    severityId: Number(testCaseData.severityId),
    defectTypeId: Number(testCaseData.defectTypeId),
  });

  const payload = response.data;
  return {
    status: payload?.status || "success",
    statusCode: payload?.statusCode || response.status || 201,
    message: payload?.message || "Test case created successfully",
    statusMessage: payload?.message || "Test case created successfully",
    data: payload?.data,
  };
}

export const createTestCaseSub = async (
  subModuleId: number,
  payload: CreateTestCaseRequest
): Promise<CreateTestCaseResponse> => {
  return createTestCase(subModuleId, payload);
};

import apiClient from "../../lib/api";

export const getReleaseTestCaseCount = async (releaseId: string | number) => {
  try {
    const response = await apiClient.get(`/api/v1/release-test-cases/release/${releaseId}/test-case/count`);
    return response.data;
  } catch (error) {
    return {
      status: 'error',
      statusCode: 500,
      data: {
        releaseId: Number(releaseId),
        totalTestCases: 0,
        passedTestCases: 0,
        failedTestCases: 0,
        blockedTestCases: 0,
        unexecutedTestCases: 0,
      },
    };
  }
};

export const getReleaseTestCaseCounts = getReleaseTestCaseCount;
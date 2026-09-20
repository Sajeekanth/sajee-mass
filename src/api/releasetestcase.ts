import apiClient from "../lib/api";

interface TestCase {
  id: string | number;
  module: string;
  subModule: string;
  description: string;
  steps: string;
  type: string;
  severity: string;
  projectId: string;
  releaseId?: string;
  testCaseId?: string;
  testcaseNo?: string;
  executionStatus?: string;
}

export interface GetTestCasesByFilterResponse {
  status: string;
  message: string;
  data: TestCase[];
  statusCode: number;
}

export const getTestCasesByFilter = async (
  projectId: string | number,
  moduleId: string | number,
  submoduleId: string | number,
  releaseId: string | number
): Promise<GetTestCasesByFilterResponse> => {
  try {
    const params: Record<string, any> = {};
    if (moduleId) params.moduleId = Number(moduleId);
    if (submoduleId) params.subModuleId = Number(submoduleId);

    const response = await apiClient.get(`/api/v1/release-test-cases/release/${releaseId}/test-case`, { params });
    const items = response.data?.data || [];

    return {
      status: 'success',
      message: 'Fetched successfully',
      statusCode: 200,
      data: items.map((t: any) => ({
        id: t.id,
        testCaseId: t.testcaseNo || `TC-${t.testCaseId || t.id}`,
        testcaseNo: t.testcaseNo,
        module: t.moduleName || '',
        subModule: t.subModuleName || '',
        description: t.description || '',
        steps: t.steps || '',
        type: t.defectTypeName || '',
        severity: t.severityName || '',
        projectId: String(projectId),
        releaseId: String(releaseId),
        executionStatus: t.passOrFail || 'NOT_RUN',
      })),
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error?.response?.data?.message || 'Failed to fetch test cases',
      statusCode: error?.response?.status || 500,
      data: [],
    };
  }
};

export const allocateTestCaseToRelease = async (
  releaseId: number,
  testCaseId: number
): Promise<any> => {
  const response = await apiClient.post(`/api/v1/release-test-cases/release/${releaseId}/test-case`, {
    releaseId,
    testCaseIds: [testCaseId],
  });
  return response.data;
};

export const allocateTestCaseToMultipleReleases = async (
  testCaseId: string | number,
  releaseIds: (string | number)[]
): Promise<{ results: any[]; failed: { releaseId: number; error: string }[]; message: string }> => {
  const results: any[] = [];
  const failed: { releaseId: number; error: string }[] = [];

  for (const r of releaseIds) {
    try {
      const resp = await allocateTestCaseToRelease(Number(r), Number(testCaseId));
      results.push({ releaseId: Number(r), status: 'success', data: resp });
    } catch (err: any) {
      failed.push({
        releaseId: Number(r),
        error: err?.response?.data?.message || err?.message || 'Allocation failed',
      });
    }
  }

  return {
    results,
    failed,
    message: `Test case allocated to ${results.length} release(s) successfully.${failed.length ? ` Failed: ${failed.length}` : ''}`,
  };
};

export const allocateTestCasesToManyReleases = async (
  releaseIds: (string | number)[],
  releaseNames: string[],
  testCaseIds: (string | number)[]
): Promise<any> => {
  const promises = releaseIds.map(async (r, idx) => {
    try {
      const resp = await apiClient.post(`/api/v1/release-test-cases/release/${r}/test-case`, {
        releaseId: Number(r),
        testCaseIds: testCaseIds.map(Number),
      });
      return {
        releaseId: r,
        releaseName: releaseNames[idx] || `Release ${r}`,
        status: 'fulfilled',
        data: resp.data,
        error: null,
      };
    } catch (err: any) {
      return {
        releaseId: r,
        releaseName: releaseNames[idx] || `Release ${r}`,
        status: 'rejected',
        data: null,
        error: err,
      };
    }
  });

  return Promise.all(promises);
};

export const bulkAllocateTestCasesToReleases = async (
  testCaseIds: (string | number)[],
  releaseId: string | number
): Promise<any> => {
  const response = await apiClient.post(`/api/v1/release-test-cases/release/${releaseId}/test-case`, {
    releaseId: Number(releaseId),
    testCaseIds: testCaseIds.map(Number),
  });
  return response.data;
};

export const getReleaseTestCasesByFiltersGroup = async (params: {
  releaseId: number;
  moduleId?: number;
  subModuleId?: number;
  projectId?: number;
}): Promise<any> => {
  const queryParams: Record<string, any> = {};
  if (params.moduleId) queryParams.moduleId = params.moduleId;
  if (params.subModuleId) queryParams.subModuleId = params.subModuleId;

  const response = await apiClient.get(`/api/v1/release-test-cases/release/${params.releaseId}/test-case`, {
    params: queryParams,
  });

  const list = response.data?.data || [];
  return {
    status: 'success',
    data: list.map((tc: any) => ({
      id: tc.id,
      testCaseId: tc.testcaseNo || `TC-${tc.testCaseId || tc.id}`,
      testcaseNo: tc.testcaseNo,
      description: tc.description,
      steps: tc.steps,
      type: tc.defectTypeName || tc.type,
      severity: tc.severityName || tc.severity,
      moduleId: tc.moduleId || params.moduleId,
      subModuleId: tc.subModuleId || params.subModuleId,
      executionStatus: tc.passOrFail || 'NOT_RUN',
      backendId: tc.id,
    })),
  };
};

export const getQaAllocationSummary = async (_qaEngineerIds: string): Promise<any> => {
  return {
    status: 'success',
    data: {
      allocationSummary: {
        totalAllocated: 0,
        qaEngineerCount: 0,
        remaining: 0,
        qaEngineers: [],
      },
    },
    statusCode: 200,
  };
};

export const getQaEngineerTestCases = async (_params: any): Promise<any> => {
  return {
    status: 'success',
    data: [],
    statusCode: 200,
  };
};

export const getDefectTestCaseCounts = async (_releaseId: string | number): Promise<any> => {
  return {
    status: 'success',
    data: [],
    statusCode: 200,
  };
};

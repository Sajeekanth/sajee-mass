import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface ProjectRelease {
  id: string;
  releaseId: string;
  releaseName: string;
  name: string;
  version: string;
  description: string;
  status: string;
  releaseDate: string;
  releaseType_name: string;
  releaseType_id?: number | string;
  project_id: number;
}

export const projectReleaseCardView = async (projectId: string | number) => {
  const response = await apiClient.get(ENDPOINTS.releaseByProject(Number(projectId)));
  const list = Array.isArray(response.data?.data) ? response.data.data : [];
  return {
    status: response.data?.status || 'success',
    statusCode: String(response.data?.statusCode || 200),
    message: response.data?.message || 'Success',
    data: list.map((r: any) => ({
      ...r,
      id: String(r.id),
      releaseId: String(r.id),
      releaseName: r.name || r.releaseName,
      name: r.name || r.releaseName,
      version: r.version || r.releaseVersion || '',
      description: r.description || '',
      status: r.status || 'ON_HOLD',
      releaseDate: r.releaseDate || '',
      releaseType_name: r.releaseTypeName || r.releaseType_name || '',
      releaseType_id: r.releaseTypeId || r.releaseType_id,
      project_id: Number(projectId),
    })),
  };
};

export const getReleaseTestCaseCountsLoad = async (releaseIds: number[]) => {
  const result: Record<number, any> = {};
  await Promise.all(
    releaseIds.map(async (id) => {
      try {
        const resp = await apiClient.get(`/api/v1/release-test-cases/release/${id}/test-case/count`);
        const countData = resp.data?.data;
        if (countData) {
          result[id] = {
            total: countData.totalTestCases || 0,
            passed: countData.passedTestCases || 0,
            failed: countData.failedTestCases || 0,
            blocked: countData.blockedTestCases || 0,
            unexecuted: countData.unexecutedTestCases || 0,
          };
        } else {
          result[id] = { total: 0, passed: 0, failed: 0, blocked: 0, unexecuted: 0 };
        }
      } catch {
        result[id] = { total: 0, passed: 0, failed: 0, blocked: 0, unexecuted: 0 };
      }
    })
  );
  return {
    status: 'success',
    statusCode: 200,
    data: result,
  };
};
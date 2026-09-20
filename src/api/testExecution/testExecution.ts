import apiClient from "../../lib/api";

export type ExecutionStatus =
  | "not-started"
  | "in-progress"
  | "passed"
  | "failed"
  | "blocked";

const EXECUTION_STATUS_KEY = "executionStatuses";

export function getExecutionStatuses(
  projectId: string | number,
  releaseId: string | number
): Record<string, ExecutionStatus> {
  try {
    const raw = localStorage.getItem(EXECUTION_STATUS_KEY);
    if (!raw) return {};
    const all: Record<string, any> = JSON.parse(raw);
    const proj = all[String(projectId)] || {};
    return (proj[String(releaseId)] || {}) as Record<string, ExecutionStatus>;
  } catch {
    return {};
  }
}

export function setExecutionStatus(
  projectId: string | number,
  releaseId: string | number,
  testCaseId: string | number,
  status: ExecutionStatus
): Record<string, ExecutionStatus> {
  let all: Record<string, any> = {};
  try {
    const raw = localStorage.getItem(EXECUTION_STATUS_KEY);
    all = raw ? JSON.parse(raw) : {};
  } catch {
    all = {};
  }

  const pid = String(projectId);
  const rid = String(releaseId);
  if (!all[pid]) all[pid] = {};
  if (!all[pid][rid]) all[pid][rid] = {};
  all[pid][rid][String(testCaseId)] = status;

  localStorage.setItem(EXECUTION_STATUS_KEY, JSON.stringify(all));
  return all[pid][rid] as Record<string, ExecutionStatus>;
}

export function setBulkExecutionStatuses(
  projectId: string | number,
  releaseId: string | number,
  statuses: Record<string, ExecutionStatus>
): void {
  let all: Record<string, any> = {};
  try {
    const raw = localStorage.getItem(EXECUTION_STATUS_KEY);
    all = raw ? JSON.parse(raw) : {};
  } catch {
    all = {};
  }

  const pid = String(projectId);
  const rid = String(releaseId);
  if (!all[pid]) all[pid] = {};
  all[pid][rid] = { ...(all[pid][rid] || {}), ...statuses };
  localStorage.setItem(EXECUTION_STATUS_KEY, JSON.stringify(all));
}

export const updateReleaseTestCaseStatus = async (
  releaseIdOrTestCaseId: number,
  releaseTestCaseIdOrPayload: any,
  maybePayload?: any
): Promise<any> => {
  let releaseId: number | undefined;
  let releaseTestCaseId: number;
  let payload: any;

  if (maybePayload !== undefined) {
    releaseId = releaseIdOrTestCaseId;
    releaseTestCaseId = releaseTestCaseIdOrPayload;
    payload = maybePayload;
  } else {
    releaseTestCaseId = releaseIdOrTestCaseId;
    payload = releaseTestCaseIdOrPayload;
    releaseId = payload?.releaseId;
  }

  const rawStatus = (payload?.status || payload?.testCaseStatus || payload?.passOrFail || "PASS").toString().toUpperCase();
  const normalizedStatus = (rawStatus === "PASSED" || rawStatus === "PASS") ? "PASS" : (rawStatus === "FAILED" || rawStatus === "FAIL") ? "FAIL" : (rawStatus === "BLOCKED" ? "BLOCKED" : "NOT_RUN");

  const url = releaseId
    ? `/api/v1/release-test-cases/release/${releaseId}/test-case/${releaseTestCaseId}/status`
    : `/api/v1/release-test-cases/test-case/${releaseTestCaseId}/status`;

  const response = await apiClient.patch(url, {
    passOrFail: normalizedStatus,
    priorityId: payload?.priorityId,
    assignedTo: payload?.assignedTo,
    remarks: payload?.remarks,
  });

  return response.data;
};

export const updateReleaseTestCaseStatusWithImage = async (
  releaseId: number,
  releaseTestCaseId: number,
  formData: FormData
): Promise<any> => {
  let payloadStatus: any = "PASS";
  try {
    const dataEntry = formData.get("data");
    if (dataEntry && typeof dataEntry === "object" && "text" in (dataEntry as any)) {
      const text = await (dataEntry as any).text();
      const parsed = JSON.parse(text);
      payloadStatus = parsed?.testCaseStatus || parsed?.status || "PASS";
    }
  } catch {
    // fallback
  }

  return updateReleaseTestCaseStatus(releaseId, releaseTestCaseId, { status: payloadStatus });
};
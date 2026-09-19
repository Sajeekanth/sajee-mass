import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

export interface WorkflowNodeRequest {
  id: number;
  positionX: number;
  positionY: number;
}

export interface WorkflowConnectionRequest {
  fromStatusId: number;
  toStatusId: number;
}

export interface SaveWorkflowRequest {
  projectId?: number;
  nodes: WorkflowNodeRequest[];
  connections: WorkflowConnectionRequest[];
}

export interface SaveWorkflowResponse {
  status: string;
  statusMessage: string;
  data?: any;
  statusCode: number;
}

export interface StatusInfo {
  id: number;
  name: string;
  color: string;
  type?: string;
  description?: string;
  positionX?: number;
  positionY?: number;
}

export interface WorkflowTransitionResponse {
  id: number;
  projectId?: number;
  projectName?: string;
  fromStatus: StatusInfo;
  toStatus: StatusInfo;
  isActive?: boolean;
}

export interface GetAllWorkflowsResponse {
  status: string;
  statusMessage: string;
  data: WorkflowTransitionResponse[];
  statusCode: number;
}

export interface NextStatusItem {
  id: number;
  name: string;
  color: string;
  type?: string;
  toStatus: StatusInfo;
}

export interface NextStatusResponse {
  status: string;
  statusMessage: string;
  data: NextStatusItem[];
  statusCode: number;
}

export const getAllWorkflows = async (projectId?: number): Promise<GetAllWorkflowsResponse> => {
  const response = await apiClient.get(ENDPOINTS.workflow, {
    params: projectId ? { projectId } : undefined,
  });

  const envelope = response.data;
  const rawList = envelope?.data ?? envelope ?? [];
  const data: WorkflowTransitionResponse[] = Array.isArray(rawList) ? rawList : [];

  return {
    status: envelope?.status || "success",
    statusMessage: envelope?.message || "Workflows fetched successfully",
    statusCode: response.status || 200,
    data,
  };
};

export const getWorkflowById = async (id: number): Promise<WorkflowTransitionResponse> => {
  const response = await apiClient.get(ENDPOINTS.workflowById(id));
  const envelope = response.data;
  return envelope?.data ?? envelope;
};

export const saveWorkflow = async (workflowData: SaveWorkflowRequest): Promise<SaveWorkflowResponse> => {
  const response = await apiClient.post(ENDPOINTS.workflow, workflowData);
  const envelope = response.data;

  return {
    status: envelope?.status || "success",
    statusMessage: envelope?.message || "Workflow saved successfully",
    statusCode: response.status || 200,
    data: envelope?.data ?? envelope,
  };
};

export const createTransition = async (data: {
  projectId?: number;
  fromStatusId: number;
  toStatusId: number;
}): Promise<WorkflowTransitionResponse> => {
  try {
    const response = await apiClient.post(`${ENDPOINTS.workflow}/transition`, data);
    const envelope = response.data;
    return envelope?.data ?? envelope;
  } catch (error: any) {
    const backendMessage = error.response?.data?.message || error.message;
    if (backendMessage && error.message !== backendMessage) {
      error.message = backendMessage;
    }
    throw error;
  }
};

export const updateTransition = async (
  id: number,
  data: {
    projectId?: number;
    fromStatusId: number;
    toStatusId: number;
    isActive?: boolean;
  }
): Promise<WorkflowTransitionResponse> => {
  const response = await apiClient.put(ENDPOINTS.workflowById(id), data);
  const envelope = response.data;
  return envelope?.data ?? envelope;
};

export const deleteTransition = async (id: number): Promise<void> => {
  await apiClient.delete(ENDPOINTS.workflowById(id));
};

export const getNextStatuses = async (
  fromStatusId: number,
  projectId?: number
): Promise<NextStatusResponse> => {
  const response = await apiClient.get(ENDPOINTS.workflowNextStatus(fromStatusId), {
    params: projectId ? { projectId } : undefined,
  });

  const envelope = response.data;
  const rawList = envelope?.data ?? envelope ?? [];

  const data: NextStatusItem[] = Array.isArray(rawList)
    ? rawList.map((item: any) => {
        const toStatusInfo: StatusInfo = item.toStatus || {
          id: item.id,
          name: item.name,
          color: item.color,
          type: item.type,
          description: item.description,
          positionX: item.positionX,
          positionY: item.positionY,
        };

        return {
          id: toStatusInfo.id,
          name: toStatusInfo.name,
          color: toStatusInfo.color,
          type: toStatusInfo.type,
          toStatus: toStatusInfo,
        };
      })
    : [];

  return {
    status: envelope?.status || "success",
    statusMessage: envelope?.message || "Next statuses fetched",
    statusCode: response.status || 200,
    data,
  };
};

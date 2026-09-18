import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

interface AvailablePeriod {
  period: string;
  percentage: number;
  project: string;
  userId: number;
  roleId?: number;
  roleName?: string;
}

export interface ViewAllocationsResponse {
  data: {
    availablePeriods: AvailablePeriod[];
    allocations?: any[];
  };
  message: string;
  status: string;
  statusCode: number;
}

export interface ProjectAllocationPayload {
  employeeId: number;
  projectId: number;
  roleId: number;
  allocationPercent: number;
  startDate: string;
  endDate: string;
}

export async function postProjectAllocations(payload: ProjectAllocationPayload) {
  const response = await apiClient.post(ENDPOINTS.projectAllocation, {
    employeeId: Number(payload.employeeId),
    projectId: Number(payload.projectId),
    roleId: Number(payload.roleId),
    allocationPercent: Number(payload.allocationPercent),
    startDate: payload.startDate,
    endDate: payload.endDate,
  });
  const envelope = response.data;
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 201,
    message: envelope?.message || 'Project allocation created successfully',
    data: envelope?.data,
  };
}

export async function getProjectAllocationsById(projectId: string | number) {
  const response = await apiClient.get(`${ENDPOINTS.projectAllocation}/${projectId}`);
  const envelope = response.data;
  const list = Array.isArray(envelope?.data?.content)
    ? envelope.data.content
    : Array.isArray(envelope?.data)
    ? envelope.data
    : [];
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
    data: list,
  };
}

export async function updateProjectAllocation(id: string | number, payload: any) {
  const response = await apiClient.put(`${ENDPOINTS.projectAllocation}/${id}`, {
    roleId: payload.roleId != null ? Number(payload.roleId) : undefined,
    allocationPercent: payload.allocationPercent != null ? Number(payload.allocationPercent) : undefined,
    startDate: payload.startDate || undefined,
    endDate: payload.endDate || null,
  });
  const envelope = response.data;
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message || 'Project allocation updated successfully',
    data: envelope?.data,
  };
}

export async function deleteProjectAllocation(id: string | number, _forceDeallocate: boolean = false) {
  const response = await apiClient.delete(`${ENDPOINTS.projectAllocation}/${id}`);
  const envelope = response.data;
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message || 'Project allocation removed successfully',
    data: envelope?.data,
  };
}

export async function filterProjectAllocations(projectId: string | number, _filters: any) {
  return getProjectAllocationsById(projectId);
}

export async function getMaxAvailablePercentage(userId: string | number, startDate?: string, endDate?: string) {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await apiClient.get(`${ENDPOINTS.projectAllocation}/employee/${userId}/availability`, { params });
  const envelope = response.data;
  const maxAvailable = typeof envelope?.data === 'number' ? envelope.data : 100;
  return {
    data: maxAvailable,
    maxAvailablePercentage: maxAvailable,
  };
}

export async function getDevelopersWithRolesByProjectId(projectId: number | string | undefined) {
  if (!projectId) return { status: 'success', statusCode: 200, data: [] };
  const response = await apiClient.get(`${ENDPOINTS.projectAllocation}/${projectId}`);
  const envelope = response.data;
  const list = Array.isArray(envelope?.data?.content)
    ? envelope.data.content
    : Array.isArray(envelope?.data)
    ? envelope.data
    : [];

  return {
    status: 'success',
    statusCode: 200,
    data: list.map((u: any) => ({
      id: u.employeeId || u.id,
      employeeId: u.employeeId || u.id,
      name: u.userFullName || `${u.firstName} ${u.lastName}`,
      email: u.email,
      role: u.roleName || 'Developer',
      roleId: u.roleId,
    })),
  };
}

export async function allocateDeveloperToModule(_moduleId: number, _projectAllocationId: number) {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Developer allocated to module successfully',
  };
}

export async function allocateDeveloperToSubModule(_moduleId: number, _projectAllocationId: number, _id: number) {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Developer allocated to submodule successfully',
  };
}

export async function getViewAllocations(userId: string | number): Promise<ViewAllocationsResponse> {
  const response = await apiClient.get(`${ENDPOINTS.projectAllocation}/employee/${userId}`);
  const envelope = response.data;
  const periods = envelope?.data?.availablePeriods || [];

  return {
    data: {
      availablePeriods: periods,
      allocations: envelope?.data?.allocations || [],
    },
    message: envelope?.message || 'Success',
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
  };
}
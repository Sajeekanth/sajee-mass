import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export async function getBenchList(): Promise<any[]> {
  const response = await apiClient.get(ENDPOINTS.benchEmployee);
  const envelope = response.data;
  const paged = envelope?.data;
  const list = Array.isArray(paged?.content)
    ? paged.content
    : Array.isArray(paged)
    ? paged
    : [];
  return list;
}

export const getViewAllocation = async (userId: string | number) => {
  const response = await apiClient.get(`${ENDPOINTS.projectAllocation}/employee/${userId}`);
  const envelope = response.data;
  return {
    data: envelope?.data || {},
  };
};

export async function getEmployeeDetails(id: string | number): Promise<any> {
  const response = await apiClient.get(ENDPOINTS.employeeById(Number(id)));
  return response.data;
}

export const getBenchAvailability = async (page: number = 0, size: number = 5, filters: any = {}) => {
  const params: Record<string, any> = {
    page,
    size,
  };

  if (filters.designation) {
    params.designation = filters.designation;
  }
  if (filters.minAvailable != null) {
    params.minAvailable = filters.minAvailable;
  } else if (filters.availability != null) {
    params.minAvailable = filters.availability;
  }
  if (filters.startDate) {
    params.startDate = filters.startDate;
  }
  if (filters.endDate) {
    params.endDate = filters.endDate;
  }
  if (filters.search) {
    params.search = filters.search;
  }
  if (filters.firstName) {
    params.firstName = filters.firstName;
  }
  if (filters.lastName) {
    params.lastName = filters.lastName;
  }

  const response = await apiClient.get(ENDPOINTS.benchEmployee, { params });
  const envelope = response.data;
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
    data: envelope?.data || {},
  };
};

export const getEmployeeProjectHistory = async (userId: string | number) => {
  const response = await apiClient.get(`${ENDPOINTS.projectAllocation}/employee/${userId}`);
  const envelope = response.data;
  const allocations = envelope?.data?.allocations || [];
  return {
    data: allocations.map((a: any) => ({
      id: a.id,
      projectName: a.projectName,
      roleName: a.roleName,
      allocationPercent: a.allocationPercent,
      startDate: a.startDate,
      endDate: a.endDate,
    })),
  };
};
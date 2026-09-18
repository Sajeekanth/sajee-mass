import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";
import { Project } from "../types";

export interface AvailableManager {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  designationId: number;
  designationName: string;
  availabilityPercent: number;
  isActive: boolean;
}

export const getAllProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get(ENDPOINTS.project);
  const envelope = response.data;
  const paged = envelope?.data;
  const list = Array.isArray(paged?.content)
    ? paged.content
    : Array.isArray(paged)
    ? paged
    : [];
  return list;
};

export const getAllProjectsForDashbord = async (): Promise<any> => {
  const response = await apiClient.get(ENDPOINTS.project);
  const envelope = response.data;
  const paged = envelope?.data;
  const list = Array.isArray(paged?.content)
    ? paged.content
    : Array.isArray(paged)
    ? paged
    : [];
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
    data: list,
  };
};

export async function updateProject(id: number | string, projectData: any) {
  const payload = {
    name: projectData.name?.trim(),
    prefix: projectData.prefix?.trim() || undefined,
    projectType: projectData.projectType?.trim() || undefined,
    startDate: projectData.startDate?.trim?.() ? projectData.startDate.trim() : (projectData.startDate || null),
    endDate: projectData.endDate?.trim?.() ? projectData.endDate.trim() : (projectData.endDate || null),
    projectManagerId: Number(projectData.projectManagerId || projectData.managerId || projectData.userId || projectData.manager),
    managerAllocation: projectData.managerAllocation !== undefined && projectData.managerAllocation !== null && projectData.managerAllocation !== ''
      ? Number(projectData.managerAllocation)
      : undefined,
    clientName: projectData.clientName?.trim() || undefined,
    clientCountry: projectData.clientCountry?.trim() || projectData.country?.trim() || undefined,
    clientState: projectData.clientState?.trim() || projectData.state?.trim() || undefined,
    clientEmail: projectData.clientEmail?.trim() || projectData.email?.trim() || undefined,
    clientPhone: projectData.clientPhone?.trim() || projectData.phoneNo?.trim() || undefined,
    address: projectData.address?.trim() || undefined,
    description: projectData.description?.trim() || undefined,
    status: projectData.status || projectData.projectStatus || 'Active',
  };

  const response = await apiClient.put(ENDPOINTS.projectById(Number(id)), payload);
  const envelope = response.data;
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message || 'Project updated successfully',
    data: envelope?.data,
  };
}

export async function deleteProject(id: string | number) {
  const response = await apiClient.delete(ENDPOINTS.projectById(Number(id)));
  const envelope = response.data;
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message || 'Project deleted successfully',
    statusMessage: envelope?.message || 'Project deleted successfully',
    success: true,
  };
}

export async function createProject(projectData: any) {
  const payload = {
    name: projectData.name?.trim(),
    prefix: projectData.prefix?.trim() || undefined,
    projectType: projectData.projectType?.trim() || undefined,
    startDate: projectData.startDate?.trim?.() ? projectData.startDate.trim() : (projectData.startDate || null),
    endDate: projectData.endDate?.trim?.() ? projectData.endDate.trim() : (projectData.endDate || null),
    projectManagerId: Number(projectData.projectManagerId || projectData.managerId || projectData.userId || projectData.manager),
    managerAllocation: projectData.managerAllocation !== undefined && projectData.managerAllocation !== null && projectData.managerAllocation !== ''
      ? Number(projectData.managerAllocation)
      : undefined,
    clientName: projectData.clientName?.trim() || undefined,
    clientCountry: projectData.clientCountry?.trim() || projectData.country?.trim() || undefined,
    clientState: projectData.clientState?.trim() || projectData.state?.trim() || undefined,
    clientEmail: projectData.clientEmail?.trim() || projectData.email?.trim() || undefined,
    clientPhone: projectData.clientPhone?.trim() || projectData.phoneNo?.trim() || undefined,
    address: projectData.address?.trim() || undefined,
    description: projectData.description?.trim() || undefined,
    status: projectData.status || projectData.projectStatus || 'Active',
  };

  const response = await apiClient.post(ENDPOINTS.project, payload);
  const envelope = response.data;
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 201,
    message: envelope?.message || 'Project created successfully',
    data: envelope?.data,
  };
}

export const getAvailableManagers = async (designationId?: number): Promise<AvailableManager[]> => {
  if (!designationId) return [];
  const response = await apiClient.get(ENDPOINTS.availableManagers(designationId));
  const envelope = response.data;
  const data = envelope?.data;
  return Array.isArray(data) ? data : [];
};

export const getAvailableManagersForUpdate = async (
  designationId?: number,
  projectId?: number
): Promise<AvailableManager[]> => {
  if (!designationId) return [];
  if (projectId) {
    const response = await apiClient.get(ENDPOINTS.availableManagersForUpdate(designationId, projectId));
    const envelope = response.data;
    const data = envelope?.data;
    return Array.isArray(data) ? data : [];
  }
  return getAvailableManagers(designationId);
};

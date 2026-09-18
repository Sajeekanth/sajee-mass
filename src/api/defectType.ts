import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

export interface ApiDefectType {
  id: number;
  name: string;
  defectTypeName: string;
  description: string;
  category?: 'functional' | 'performance' | 'security' | 'usability' | 'compatibility' | 'other';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetDefectTypesResponse {
  status: string;
  message: string;
  statusCode?: number;
  data: {
    content: ApiDefectType[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };
}

export const createDefectType = async (data: { name: string; description?: string }) => {
  const response = await apiClient.post(ENDPOINTS.defectType, {
    name: data.name,
    description: data.description,
  });
  const envelope = response.data;
  const created = envelope?.data || {};
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 201,
    message: envelope?.message || 'Defect type created successfully',
    data: {
      id: created.id,
      name: created.name || created.defectTypeName,
      defectTypeName: created.defectTypeName || created.name,
    },
  };
};

export const updateDefectType = async (id: number, data: { name: string; description?: string }) => {
  const response = await apiClient.put(ENDPOINTS.defectTypeById(id), {
    name: data.name,
    description: data.description,
  });
  const envelope = response.data;
  const updated = envelope?.data || {};
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message || 'Defect type updated successfully',
    data: {
      id: updated.id,
      name: updated.name || updated.defectTypeName,
      defectTypeName: updated.defectTypeName || updated.name,
    },
  };
};

export const getDefectTypes = async (page = 0, size = 100): Promise<GetDefectTypesResponse> => {
  const response = await apiClient.get(ENDPOINTS.defectType, {
    params: { page, size },
  });
  const envelope = response.data;
  const paged = envelope?.data;
  const rawList: any[] = Array.isArray(paged?.content)
    ? paged.content
    : Array.isArray(paged)
    ? paged
    : [];

  const now = new Date().toISOString();
  const content: ApiDefectType[] = rawList.map((d: any) => {
    const resolvedName = d.name || d.defectTypeName || '';
    return {
      id: d.id,
      name: resolvedName,
      defectTypeName: d.defectTypeName || resolvedName,
      description: d.description || resolvedName,
      category: 'functional',
      severity: 'medium',
      priority: 'medium',
      isActive: d.isActive !== undefined ? d.isActive : true,
      createdAt: d.createdAt || now,
      updatedAt: d.updatedAt || now,
    };
  });

  return {
    status: envelope?.status || 'success',
    message: envelope?.message || 'Success',
    statusCode: envelope?.statusCode || 200,
    data: {
      content,
      totalElements: paged?.totalElements !== undefined ? paged.totalElements : content.length,
      totalPages: paged?.totalPages !== undefined ? paged.totalPages : 1,
      pageNumber: paged?.pageNumber !== undefined ? paged.pageNumber : page,
      pageSize: paged?.pageSize !== undefined ? paged.pageSize : size,
    },
  };
};

export const deleteDefectType = async (id: number) => {
  const response = await apiClient.delete(ENDPOINTS.defectTypeById(id));
  const envelope = response.data;
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message || 'Defect type deleted successfully',
  };
};
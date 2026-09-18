import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

export interface DefectStatus {
  id: number;
  name: string;
  statusName?: string;
  color: string;
  type?: string;
  statusType?: string;
}

export interface DefectStatusData {
  content: DefectStatus[];
  data?: DefectStatus[];
  totalPages: number;
  totalElements?: number;
}

export interface DefectStatusResponse {
  status: string;
  statusMessage: string;
  message: string;
  data: DefectStatusData;
  statusCode: number;
}

export interface CreateDefectStatusRequest {
  name: string;
  color: string;
  type: string;
  description?: string;
}

export interface UpdateDefectStatusRequest {
  name: string;
  color: string;
  type: string;
  description?: string;
}

export const getAllDefectStatuses = async (
  page: number = 0,
  pageSize: number = 100
): Promise<DefectStatusData> => {
  const response = await apiClient.get(ENDPOINTS.statusType, {
    params: { page, size: pageSize },
  });
  const envelope = response.data;
  const paged = envelope?.data;
  const rawList: any[] = Array.isArray(paged?.content)
    ? paged.content
    : Array.isArray(paged)
    ? paged
    : [];

  const content: DefectStatus[] = rawList.map((s: any) => {
    const resolvedName = s.name || s.statusName || '';
    const resolvedType = s.type || s.statusType || '';
    return {
      id: s.id,
      name: resolvedName,
      statusName: resolvedName,
      color: s.color || '',
      type: resolvedType,
      statusType: resolvedType,
    };
  });

  const totalPages = paged?.totalPages !== undefined ? paged.totalPages : 1;
  const totalElements = paged?.totalElements !== undefined ? paged.totalElements : content.length;

  return {
    content,
    data: content,
    totalPages,
    totalElements,
  };
};

export const createDefectStatus = async (
  statusData: CreateDefectStatusRequest
): Promise<DefectStatusResponse> => {
  const response = await apiClient.post(ENDPOINTS.statusType, {
    name: statusData.name,
    type: statusData.type,
    color: statusData.color,
    description: statusData.description,
  });
  const envelope = response.data;
  const created = envelope?.data || {};
  const resolvedName = created.name || created.statusName || statusData.name;
  const resolvedType = created.type || created.statusType || statusData.type;

  const item: DefectStatus = {
    id: created.id,
    name: resolvedName,
    statusName: resolvedName,
    color: created.color || statusData.color,
    type: resolvedType,
    statusType: resolvedType,
  };

  const statusMsg = envelope?.message || 'Status created successfully';
  return {
    status: envelope?.status || 'success',
    statusMessage: statusMsg,
    message: statusMsg,
    statusCode: envelope?.statusCode || 201,
    data: {
      content: [item],
      data: [item],
      totalPages: 1,
      totalElements: 1,
    },
  };
};

export const updateDefectStatus = async (
  id: number,
  statusData: UpdateDefectStatusRequest
): Promise<DefectStatusResponse> => {
  const response = await apiClient.put(ENDPOINTS.statusTypeById(id), {
    name: statusData.name,
    type: statusData.type,
    color: statusData.color,
    description: statusData.description,
  });
  const envelope = response.data;
  const updated = envelope?.data;
  const resolvedName = updated?.name || updated?.statusName || statusData.name;
  const resolvedType = updated?.type || updated?.statusType || statusData.type;

  const item: DefectStatus = {
    id: updated?.id || id,
    name: resolvedName,
    statusName: resolvedName,
    color: updated?.color || statusData.color,
    type: resolvedType,
    statusType: resolvedType,
  };

  const statusMsg = envelope?.message || 'Status updated successfully';
  return {
    status: envelope?.status || 'success',
    statusMessage: statusMsg,
    message: statusMsg,
    statusCode: envelope?.statusCode || 200,
    data: {
      content: updated ? [item] : [],
      data: updated ? [item] : [],
      totalPages: 1,
      totalElements: updated ? 1 : 0,
    },
  };
};

export const deleteDefectStatus = async (id: number): Promise<DefectStatusResponse> => {
  const response = await apiClient.delete(ENDPOINTS.statusTypeById(id));
  const envelope = response.data;
  const statusMsg = envelope?.message || 'Status deleted successfully';
  return {
    status: envelope?.status || 'success',
    statusMessage: statusMsg,
    message: statusMsg,
    statusCode: envelope?.statusCode || 200,
    data: {
      content: [],
      data: [],
      totalPages: 1,
      totalElements: 0,
    },
  };
};

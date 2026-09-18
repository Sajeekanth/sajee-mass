import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

export interface Releasetype {
  id: number;
  name?: string;
  releaseTypeName: string;
}

export interface ReleaseTypeList {
  totalElements?: number;
  content?: (Releasetype & { name: string })[];
}

export interface ReleaseTypeResponse {
  status: string;
  statusMessage: string;
  message?: string;
  data: ReleaseTypeList;
  statusCode: number;
}

export interface CreateReleaseTypeRequest {
  name?: string;
  releaseTypeName: string;
  description?: string;
}

export interface UpdateReleaseTypeRequest {
  name?: string;
  releaseTypeName: string;
  description?: string;
}

export const getAllReleaseTypes = async (page: number = 0, size: number = 100): Promise<ReleaseTypeResponse> => {
  const response = await apiClient.get(ENDPOINTS.releaseType, {
    params: { page, size },
  });
  const envelope = response.data;
  const paged = envelope?.data;
  const rawList: any[] = Array.isArray(paged?.content)
    ? paged.content
    : Array.isArray(paged)
    ? paged
    : [];

  const content = rawList.map((r: any) => {
    const resolvedName = r.name || r.releaseTypeName || '';
    return {
      id: r.id,
      name: resolvedName,
      releaseTypeName: r.releaseTypeName || resolvedName,
    };
  });

  const totalElements = paged?.totalElements !== undefined ? paged.totalElements : content.length;
  const statusMsg = envelope?.message || 'Success';

  return {
    status: envelope?.status || 'success',
    statusMessage: statusMsg,
    message: statusMsg,
    statusCode: envelope?.statusCode || 200,
    data: {
      totalElements,
      content,
    },
  };
};

export const createReleaseType = async (data: CreateReleaseTypeRequest): Promise<Releasetype> => {
  const resolvedName = data.name || data.releaseTypeName;
  const response = await apiClient.post(ENDPOINTS.releaseType, {
    name: resolvedName,
    releaseTypeName: resolvedName,
    description: data.description,
  });
  const envelope = response.data;
  const created = envelope?.data || {};
  const finalName = created.name || created.releaseTypeName || resolvedName;
  return {
    id: created.id,
    name: finalName,
    releaseTypeName: finalName,
  };
};

export const updateReleaseType = async (id: number, data: UpdateReleaseTypeRequest): Promise<Releasetype> => {
  const resolvedName = data.name || data.releaseTypeName;
  const response = await apiClient.put(ENDPOINTS.releaseTypeById(id), {
    name: resolvedName,
    releaseTypeName: resolvedName,
    description: data.description,
  });
  const envelope = response.data;
  const updated = envelope?.data;
  const finalName = updated?.name || updated?.releaseTypeName || resolvedName;
  return {
    id: updated?.id || id,
    name: finalName,
    releaseTypeName: finalName,
  };
};

export const deleteReleaseType = async (id: number): Promise<any> => {
  const response = await apiClient.delete(ENDPOINTS.releaseTypeById(id));
  const envelope = response.data;
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message || 'Release type deleted successfully',
  };
};
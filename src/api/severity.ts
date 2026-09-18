import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

export interface Severity {
  id: number;
  name: string;
  color: string;
  weight: number;
}

export interface CreateSeverityRequest {
  name: string;
  color: string;
  weight: number;
}

export interface CreateSeverityResponse {
  status: string;
  message: string;
  statusCode: number;
  data?: Severity;
}

export interface GetSeveritiesResponse {
  status: string;
  message: string;
  data: {
    content: Severity[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export const createSeverity = async (data: CreateSeverityRequest): Promise<CreateSeverityResponse> => {
  const response = await apiClient.post(ENDPOINTS.severity, data);
  const envelope = response.data;
  const created = envelope?.data || {};
  return {
    status: envelope?.status || 'success',
    message: envelope?.message || 'Severity created successfully',
    statusCode: envelope?.statusCode || 201,
    data: {
      id: created.id,
      name: created.name || created.severityName,
      color: created.color,
      weight: created.weight !== undefined ? created.weight : data.weight,
    },
  };
};

export const updateSeverity = async (id: number, data: Partial<CreateSeverityRequest>): Promise<CreateSeverityResponse> => {
  const response = await apiClient.put(ENDPOINTS.severityById(id), data);
  const envelope = response.data;
  const updated = envelope?.data;
  return {
    status: envelope?.status || 'success',
    message: envelope?.message || 'Severity updated successfully',
    statusCode: envelope?.statusCode || 200,
    data: updated
      ? {
          id: updated.id,
          name: updated.name || updated.severityName,
          color: updated.color,
          weight: updated.weight,
        }
      : undefined,
  };
};

export const getSeverities = async (
  page: number = 0,
  pageSize: number = 100
): Promise<GetSeveritiesResponse> => {
  const response = await apiClient.get(ENDPOINTS.severity, {
    params: { page, size: pageSize },
  });
  const envelope = response.data;
  const paged = envelope?.data;
  const rawList: any[] = Array.isArray(paged?.content)
    ? paged.content
    : Array.isArray(paged)
    ? paged
    : [];

  const content: Severity[] = rawList.map((s: any) => ({
    id: s.id,
    name: s.name || s.severityName || '',
    color: s.color || '',
    weight: s.weight !== undefined ? s.weight : 0,
  }));

  return {
    status: envelope?.status || 'success',
    message: envelope?.message || 'Severities fetched successfully',
    data: {
      content,
      totalElements: paged?.totalElements !== undefined ? paged.totalElements : content.length,
      totalPages: paged?.totalPages !== undefined ? paged.totalPages : 1,
      size: paged?.pageSize !== undefined ? paged.pageSize : pageSize,
      number: paged?.pageNumber !== undefined ? paged.pageNumber : page,
    },
  };
};

export const deleteSeverity = async (id: number) => {
  const response = await apiClient.delete(ENDPOINTS.severityById(id));
  const envelope = response.data;
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message || 'Severity deleted successfully',
  };
};

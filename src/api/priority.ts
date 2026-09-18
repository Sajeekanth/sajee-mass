import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

export interface Priority {
  id: number;
  name: string;
  color: string;
}

export interface GetPrioritiesResponse {
  status: string;
  message: string;
  data: {
    content: Priority[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export const getAllPriorities = async (
  page: number = 0,
  pageSize: number = 100
): Promise<GetPrioritiesResponse> => {
  const response = await apiClient.get(ENDPOINTS.priority, {
    params: { page, size: pageSize },
  });
  const envelope = response.data;
  const paged = envelope?.data;
  const rawList: any[] = Array.isArray(paged?.content)
    ? paged.content
    : Array.isArray(paged)
    ? paged
    : [];

  const content: Priority[] = rawList.map((p: any) => ({
    id: p.id,
    name: p.name || p.priorityName || '',
    color: p.color || '',
  }));

  return {
    status: envelope?.status || 'success',
    message: envelope?.message || 'Priorities fetched successfully',
    data: {
      content,
      totalElements: paged?.totalElements !== undefined ? paged.totalElements : content.length,
      totalPages: paged?.totalPages !== undefined ? paged.totalPages : 1,
      size: paged?.pageSize !== undefined ? paged.pageSize : pageSize,
      number: paged?.pageNumber !== undefined ? paged.pageNumber : page,
    },
  };
};

export const updatePriority = async (id: number, data: { name: string; color: string }) => {
  const response = await apiClient.put(ENDPOINTS.priorityById(id), data);
  const envelope = response.data;
  const updated = envelope?.data;
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message || 'Priority updated successfully',
    data: updated
      ? {
          id: updated.id,
          name: updated.name || updated.priorityName,
          color: updated.color,
        }
      : null,
  };
};

export const deletePriority = async (id: number) => {
  const response = await apiClient.delete(ENDPOINTS.priorityById(id));
  const envelope = response.data;
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message || 'Priority deleted successfully',
  };
};

export const createPriority = async (data: { name: string; color: string }) => {
  const response = await apiClient.post(ENDPOINTS.priority, data);
  const envelope = response.data;
  const created = envelope?.data || {};
  return {
    status: envelope?.status || 'success',
    statusCode: envelope?.statusCode || 201,
    message: envelope?.message || 'Priority created successfully',
    data: {
      id: created.id,
      name: created.name || created.priorityName,
      color: created.color,
    },
  };
};
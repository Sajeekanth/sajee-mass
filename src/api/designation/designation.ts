import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface Designations {
  id: number;
  name: string;
}

export interface CreateDesignations {
  name: string;
}

export async function getDesignations(_page: number = 0, _size: number = 100) {
  const response = await apiClient.get(ENDPOINTS.designation, {
    params: { page: _page, size: _size },
  });
  const envelope = response.data;
  const paged = envelope?.data || {};
  const content = Array.isArray(paged.content)
    ? paged.content.map((d: any) => ({ id: d.id, name: d.name }))
    : Array.isArray(paged)
    ? paged.map((d: any) => ({ id: d.id, name: d.name }))
    : [];

  return {
    status: envelope?.status || "success",
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message || "Designations retrieved successfully",
    data: {
      content,
      totalElements: paged.totalElements ?? content.length,
      totalPages: paged.totalPages ?? 1,
      size: paged.size ?? _size,
      number: paged.number ?? _page,
    },
  };
}

export const getAllDesignations = getDesignations;

export async function createDesignation(data: CreateDesignations) {
  const payload = {
    name: data.name?.trim(),
    designationName: data.name?.trim(),
  };
  const response = await apiClient.post(ENDPOINTS.designation, payload);
  const envelope = response.data;
  const resData = envelope?.data || {};
  return {
    status: envelope?.status || "success",
    statusCode: envelope?.statusCode || 201,
    message: envelope?.message || "Designation created successfully",
    statusMessage: envelope?.message || "Designation created successfully",
    data: { id: resData.id, name: resData.name || resData.designationName },
  };
}

export async function putDesignation(id: number, data: CreateDesignations) {
  const payload = {
    name: data.name?.trim(),
    designationName: data.name?.trim(),
  };
  const response = await apiClient.put(ENDPOINTS.designationById(id), payload);
  const envelope = response.data;
  const resData = envelope?.data || {};
  return {
    status: envelope?.status || "success",
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message || "Designation updated successfully",
    statusMessage: envelope?.message || "Designation updated successfully",
    data: { id: resData.id || id, name: resData.name || resData.designationName || payload.name },
  };
}

export const updateDesignation = putDesignation;

export async function deleteDesignation(id: number) {
  const response = await apiClient.delete(ENDPOINTS.designationById(id));
  const envelope = response.data;
  return {
    status: envelope?.status || "success",
    statusCode: envelope?.statusCode || 200,
    message: envelope?.message || "Designation deleted successfully",
    statusMessage: envelope?.message || "Designation deleted successfully",
    data: null,
  };
}

import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface CreateReleaseRequest {
  name: string;
  releaseDate: string;
  releaseType_id?: number | string;
  releaseType_name?: string;
  releaseTypeId?: number;
  project_id: number;
  status?: string;
  description?: string;
  version?: string;
}

export interface CreateReleaseResponse {
  status: string;
  message: string;
  data: any;
  statusCode: number;
}

export const createRelease = async (payload: CreateReleaseRequest): Promise<any> => {
  const response = await apiClient.post(ENDPOINTS.release, {
    name: payload.name,
    version: payload.version,
    releaseDate: payload.releaseDate,
    releaseTypeId: Number(payload.releaseType_id || payload.releaseTypeId),
    projectId: Number(payload.project_id),
    description: payload.description,
    status: payload.status,
  });

  return {
    status: response.data?.status || 'success',
    message: response.data?.message || 'Release created successfully',
    statusCode: response.data?.statusCode || 201,
    data: response.data?.data,
  };
};

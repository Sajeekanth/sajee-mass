import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface Role {
  id: number;
  name: string;
  roleName?: string;
  type?: string;
  roleType?: string;
  description?: string;
}

export interface GetRolesResponse {
  status: string;
  statusCode?: number;
  message: string;
  data: {
    content: Role[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };
}

export const getAllRoles = async (page: number = 0, pageSize: number = 100): Promise<GetRolesResponse> => {
  const url = ENDPOINTS.role ? ENDPOINTS.role(page, pageSize) : `/api/v1/role?page=${page}&size=${pageSize}`;
  const response = await apiClient.get<GetRolesResponse>(url);
  return response.data;
};

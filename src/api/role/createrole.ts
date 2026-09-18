import apiClient from "../../lib/api";

export const createRoles = async (data: { name: string; type?: string; roleType?: string }) => {
  const response = await apiClient.post('/api/v1/role', {
    name: data.name,
    roleType: data.type || data.roleType,
    type: data.type || data.roleType,
  });
  return response.data;
};
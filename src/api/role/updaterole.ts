import apiClient from "../../lib/api";

export const updateRole = async (id: number, data: { name: string; type?: string; roleType?: string }) => {
  const response = await apiClient.put(`/api/v1/role/${id}`, {
    name: data.name,
    roleType: data.type || data.roleType,
    type: data.type || data.roleType,
  });
  return response.data;
};